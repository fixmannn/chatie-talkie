const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const models = require('../models/index');
const User = models.Users;
require('dotenv').config();


// Generate token when login
const generateToken = async (req, res, next) => {
  // Check if username is match with the database
  const username = req.body.username;
  const user = await User.findOne({where: {username: username}});
  if (!user) return res.status(401).send('Invalid username');

  // Check if password is match with database
  const comparePass = bcrypt.compareSync(req.body.password, user.dataValues.password);
  if (!comparePass) return res.status(401).send('Invalid password');

  const token = jwt.sign({
    username: username
  }, process.env.SECRET_KEY);

  res.locals.token = token;
  next();
}

// This function used for logout and change password, so user needs to re-login
const deleteToken = (username) => {
  const deletedToken = jwt.sign({username: username}, process.env.SECRET_KEY, {expiresIn: 1});
  return deletedToken;
}


// Verifying the token
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];
  if (!authHeader || !authHeader.startsWith("Bearer")) return res.status(401).send("Unauthorized");

  jwt.verify(token, process.env.SECRET_KEY, (error, username) => {
    if (error) return res.status(401).send('Invalid Token');
    req.username = username;
    next();
  });
}

module.exports = {
  authenticateUser: authenticateUser,
  generateToken: generateToken,
  deleteToken: deleteToken
};