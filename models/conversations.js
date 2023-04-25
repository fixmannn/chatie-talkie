'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Conversations extends Model {
    static associate(models) {
      Conversations.belongsTo(models.Users);
      models.Users.hasMany(Conversations);
    }
  }
  Conversations.init({
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Conversations',
  });
  return Conversations;
};