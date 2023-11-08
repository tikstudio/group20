import { DataTypes, Model } from 'sequelize';
import md5 from 'md5';
import sequelize from '../services/sequelize';

const { PASSWORD_SECRET } = process.env;

class Users extends Model {
  static passwordHas(string) {
    return md5(md5(string) + PASSWORD_SECRET);
  }

  static async sync(options) {
    await super.sync(options);
    await Users.findOrCreate({
      where: {
        id: 1,
      },
      defaults: {
        id: 1,
        firstName: 'Tigran',
        lastName: 'Muradyan',
        email: 'test@test.com',
        password: '123456',
      },
    });
    await Users.findOrCreate({
      where: {
        id: 2,
      },
      defaults: {
        id: 2,
        firstName: 'Poxos',
        lastName: 'Poxosyan',
        email: 'test2@test.com',
        password: '123456',
      },
    });
    await Users.findOrCreate({
      where: {
        id: 3,
      },
      defaults: {
        id: 3,
        firstName: 'Armen',
        lastName: 'Poxosyan',
        email: 'test3@test.com',
        password: '123456',
      },
    });
  }
}

Users.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'email',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set(val) {
      if (val) {
        this.setDataValue('password', Users.passwordHas(val));
      }
    },
    get() {
      return undefined;
    },
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  isOnline: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    get() {
      const avatar = this.getDataValue('avatar');
      if (avatar) {
        return avatar;
      }
      const email = this.getDataValue('email');

      if (email) {
        return `https://www.gravatar.com/avatar/${md5(email)}?d=robohash`;
      }
      return null;
    },
  },
}, {
  sequelize,
  tableName: 'users',
  modelName: 'users',
});
export default Users;
