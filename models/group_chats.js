'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group_chats extends Model {}
  Group_chats.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    profile_photo: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Group_chats',
    timestamps: false
  });
  return Group_chats;
};