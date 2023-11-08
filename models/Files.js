import { DataTypes, Model } from 'sequelize';
import sequelize from '../services/sequelize';
import Messages from './Messages';

class Files extends Model {

}

Files.init({
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  // messageId: {},
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  size: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'files',
  modelName: 'files',
});

Files.belongsTo(Messages, {
  foreignKey: 'messageId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'message',
});

Messages.hasMany(Files, {
  foreignKey: 'messageId',
  onDelete: 'cascade',
  onUpdate: 'cascade',
  as: 'files',
});

export default Files;
