'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group_messages extends Model {
    static associate(models) {
      Group_messages.belongsTo(models.Users, {
        foreignKey: 'sender_id',
        targetKey: 'id'
      });
      Group_messages.belongsTo(models.Group_chats, {
        foreignKey: 'group_id',
        targetKey: 'id'
      });
      models.Users.hasMany(Group_messages, {
        sourceKey: 'id',
        foreignKey: 'sender_id'
      });
      models.Group_chats.hasMany(Group_messages, {
        sourceKey: 'id',
        foreignKey: 'group_id'
      });
    }
  }
  Group_messages.init({
    sender_id: DataTypes.INTEGER,
    group_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Group_messages',
    timestamps: false
  });
  return Group_messages;
};