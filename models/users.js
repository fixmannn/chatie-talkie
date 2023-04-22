'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {}
  Users.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    profile_photo: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};