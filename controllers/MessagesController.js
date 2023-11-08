import HttpError from 'http-errors';
import fsp from 'fs/promises';
import Promise from 'bluebird';
import { Op } from 'sequelize';
import path from 'path';
import Socket from '../services/Socket';
import { Messages, Users, Files } from '../models';

class MessagesController {
  static async send(req, res, next) {
    try {
      const { userId, files } = req;
      const { friendId, text, type = 'text' } = req.body;
      const friend = await Users.findByPk(friendId);
      const user = await Users.findByPk(userId);
      if (!friend) {
        throw HttpError(404);
      }
      const message = await Messages.create({
        from: userId,
        to: friendId,
        text,
        type,
      });
      const fileDir = path.resolve('public/uploads');
      const uploadFiles = await Promise.map(files, async (file) => {
        await fsp.rename(file.path, path.join(fileDir, file.filename));
        return {
          messageId: message.id,
          type: file.mimetype,
          size: file.size,
          path: path.join('/uploads', file.filename),
        };
      });

      // message = await Messages.create({
      //   from: userId,
      //   to: friendId,
      //   text,
      //   type,
      //   include: [{
      //     model: Files,
      //     as: 'files',
      //     required: false
      //   }]
      // });

      message.files = await Files.bulkCreate(uploadFiles);
      message.setDataValue('files', message.files);

      Socket.emit(friendId, 'new-message', {
        message,
        friend: user,
        user: friend,
      });
      res.json({
        status: 'ok',
        message,
        friend,
      });
    } catch (e) {
      next(e);
    }
  }

  static async list(req, res, next) {
    try {
      const { userId } = req;
      const { friendId } = req.params;
      const { page = 1, limit = 20 } = req.params;

      const messages = await Messages.findAll({
        where: {
          [Op.or]: [
            { from: userId, to: friendId },
            { from: friendId, to: userId },
          ],
        },
        include: [{
          model: Files,
          as: 'files',
          required: false,
        }],
        limit,
        offset: (page - 1) * limit,
        order: [['createdAt', 'desc']],
      });

      res.json({
        status: 'ok',
        messages,
      });
    } catch (e) {
      next(e);
    }
  }

  static async open(req, res, next) {
    try {
      const { userId } = req;
      const { messageId } = req.params;

      const message = await Messages.findOne({
        where: {
          id: messageId,
          to: userId,
        },
      });
      if (!message) {
        throw HttpError(404);
      }
      await message.update({
        seen: true,
      });

      Socket.emit(message.from, 'open-message', {
        message,
      });

      res.json({
        status: 'ok',
        message,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default MessagesController;
