'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Conversations extends Model {
    static associate(models) {
      Conversations.belongsTo(models.Users, {
        foreignKey: 'sender_id',
        constraints: false
      });
      Conversations.belongsTo(models.Users, {
        foreignKey: 'receiver_id',
        constraints: false
      });
      models.Users.hasMany(Conversations, {
        foreignKey: 'sender_id',
        constraints: false
      });
      models.Users.hasMany(Conversations, {
        foreignKey: 'receiver_id',
        constraints: false
      });
    }
  }
  Conversations.init({
    sender_id: DataTypes.INTEGER,
    receiver_id: DataTypes.INTEGER,
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Conversations',
    timestamps: false,
  });
  return Conversations;
};