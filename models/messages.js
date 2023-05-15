'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    static associate(models) {
      Messages.belongsTo(models.Users, {
        foreignKey: 'sender_id',
        constraints: false
      });
      Messages.belongsTo(models.Users, {
        foreignKey: 'receiver_id',
        constraints: false
      });
      Messages.belongsTo(models.Conversations, {
        foreignKey: 'conversation_id',
        constraints: false
      });
      models.Users.hasMany(Messages, {
        foreignKey: 'sender_id',
        constraints: false
      });
      models.Users.hasMany(Messages, {
        foreignKey: 'receiver_id',
        constraints: false
      });
      models.Conversations.hasMany(Messages, {
        foreignKey: 'conversation_id',
        constraints: false
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