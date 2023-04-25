// Hashing password
const bcrypt = require('bcrypt');

const hashPassword = (password) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
}

module.exports = {hashPassword};
