// Validate username and email when signing up
const models = require('../models/index');
const User = models.Users;

const validateUsername = async (username) => {
  const usernameExist = await User.findOne({where: {username: username}});

  if(!usernameExist) return true;
  return false;
}

const validateEmail = async (email) => {
  const emailExist = await User.findOne({where: {email: email}});

  if(!emailExist) return true;
  return false;
}

module.exports = {
  validateUsername: validateUsername, 
  validateEmail: validateEmail
};