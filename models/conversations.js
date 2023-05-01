'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Conversations extends Model {
    static associate(models) {
      Conversations.belongsTo(models.Users, {
        foreignKey: 'sender_id',
        targetKey: 'id'
      });
      Conversations.belongsTo(models.Users, {
        foreignKey: 'receiver_id',
        targetKey: 'id'
      });
      models.Users.hasMany(Conversations, {
        sourceKey: 'id',
        foreignKey: 'sender_id'
      });
      models.Users.hasMany(Conversations, {
        sourceKey: 'id',
        foreignKey: 'receiver_id'
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