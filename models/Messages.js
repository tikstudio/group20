import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';
import Users from './Users';

class Messages extends Model {

}

Messages.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  // from: {},
  // to: {},
  text: {
    type: DataTypes.TEXT('long'),
  },
  type: {
    type: DataTypes.ENUM('text', 'voice', 'video'),
    defaultValue: 'text',
    allowNull: false,
  },
  seen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  deleted: {
    type: DataTypes.BOOLEAN,
  },
}, {
  sequelize,
  tableName: 'messages',
  modelName: 'messages',
});

Messages.belongsTo(Users, {
  foreignKey: 'from',
  onUpdate: 'cascade',
  onDelete: 'cascade',
  as: 'userFrom',
});

Messages.belongsTo(Users, {
  foreignKey: 'to',
  onUpdate: 'cascade',
  onDelete: 'cascade',
  as: 'userTo',
});

export default Messages;
