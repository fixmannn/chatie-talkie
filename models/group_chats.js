'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group_chats extends Model {}
  Group_chats.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group_chats',
    timestamps: false
  });
  return Group_chats;
};