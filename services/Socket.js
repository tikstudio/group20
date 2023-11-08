import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import Users from '../models/Users';

const { JWT_SECRET } = process.env;

class Socket {
  static init(server) {
    this.io = new SocketServer(server, {
      cors: '*',
    });

    this.io.on('connect', this.handleConnect);
  }

  static handleConnect = async (client) => {
    try {
      const { authorization = '' } = client.handshake.headers;
      const { userId } = jwt.verify(authorization.replace('Bearer ', ''), JWT_SECRET);

      // eslint-disable-next-line no-param-reassign
      client.userId = userId;

      client.join(userId.toString());

      this.io.emit('user-online', { userId });
      client.on('typing-send', this.handleTyping(client));
      client.on('disconnect', this.handleDisconnect(client));

      client.on('typing-start', (data) => {
        this.emit(data.userId, 'friend-typing-start', {
          friendId: userId,
        });
      });
      client.on('typing-end', (data) => {
        this.emit(data.userId, 'friend-typing-end', {
          friendId: userId,
        });
      });

      await Users.update({
        lastLogin: new Date(),
        isOnline: true,
      }, {
        where: {
          id: client.userId,
        },
      });
    } catch (e) {
      console.log(e);
      client.emit('error', { message: e.message });
    }
  };

  static handleTyping = () => (data) => {
    const { friendId } = data;
    this.io.to(friendId.toString())
      .emit('typing', {});
  };

  static handleDisconnect = (client) => async () => {
    const room = this.io.sockets.adapter.rooms.get(client.userId.toString());
    if (!room || room.size === 0) {
      await Users.update({
        lastLogin: new Date(),
        isOnline: false,
      }, {
        where: {
          id: client.userId,
        },
      });
      this.io.emit('user-offline', { userId: client.userId });
    }
  };

  static emit(to, ev, data) {
    if (to) {
      this.io.to(to.toString())
        .emit(ev, data);
    }
  }
}

export default Socket;
