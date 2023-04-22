'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Messages extends Model {
    static associate(models) {
      Messages.belongsTo(models.Users);
      Messages.belongsTo(models.Conversations);
      models.Users.hasMany(Messages);
      models.Conversations.hasMany(Messages);
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
  });
  return Messages;
};