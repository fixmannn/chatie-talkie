'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group_messages extends Model {
    static associate(models) {
      Group_messages.belongsTo(models.Users, {
        foreignKey: 'sender_id',
        constraints: false
      });
      Group_messages.belongsTo(models.Group_chats, {
        foreignKey: 'group_id',
        constraints: false
      });
      models.Users.hasMany(Group_messages, {
        foreignKey: 'sender_id',
        constraints: false,
      });
      models.Group_chats.hasMany(Group_messages, {
        foreignKey: 'group_id',
        constraints: false
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