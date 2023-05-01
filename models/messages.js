'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    static associate(models) {
      Messages.belongsTo(models.Users, {
        foreignKey: 'sender_id',
        targetKey: 'id'
      });
      Messages.belongsTo(models.Users, {
        foreignKey: 'receiver_id',
        targetKey: 'id'
      });
      Messages.belongsTo(models.Conversations, {
        foreignKey: 'conversation_id',
        targetKey: 'id'
      });
      models.Users.hasMany(Messages, {
        sourceKey: 'id',
        foreignKey: 'sender_id'
      });
      models.Users.hasMany(Messages, {
        sourceKey: 'id',
        foreignKey: 'receiver_id'
      });
      models.Conversations.hasMany(Messages, {
        sourceKey: 'id',
        foreignKey: 'conversation_id'
      });
    }
  }
  Messages.init({
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    conversation_id: DataTypes.INTEGER,
    content: DataTypes.TEXT,
    timestamp: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Messages',
    timestamps: false
  });
  return Messages;
};