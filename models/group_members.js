'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group_members extends Model {
    static associate(models) {
      Group_members.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        constraints: false
      });
      Group_members.belongsTo(models.Group_chats, {
        foreignKey: 'group_id',
        targetKey: 'id',
        constraints: false
      });
      models.Users.hasMany(Group_members, {
        foreignKey: 'user_id',
        constraints: false
      });
      models.Group_chats.hasMany(Group_members, {
        foreignKey: 'group_id',
        constraints: false
      })
    }
  }
  Group_members.init({
    group_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    join_date: DataTypes.DATE,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group_members',
    timestamps: false
  });
  return Group_members;
};