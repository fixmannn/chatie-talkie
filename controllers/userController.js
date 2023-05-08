const { validateEmail, validateUsername } = require('../middleware/UserValidations');
const { validatePassword } = require('../middleware/passwordValidator');
const { hashPassword } = require('../utils/hash-password');
const { deleteToken } = require('../middleware/authorization');
const models = require('../models/index');
const User = models.Users;
const jwt_decode = require('jwt-decode');
const bcrypt = require('bcrypt');
const { QueryTypes } = require('sequelize');

const signUpController = async (req, res) => {
  const emailValid = await validateEmail(req.body.email);
  const usernameValid = await validateUsername(req.body.username);
  const passwordValid = validatePassword(req.body.password);
  const hashedPassword = hashPassword(req.body.password);

  if (!emailValid) return res.status(400).send(`Email exist, please try another one!`);
  if (!usernameValid) return res.status(400).send(`Username exist, please try another one!`);
  if (!passwordValid) return res.status(400).send(`
  Password is not valid, password at least has:
  - 8 words minimum
  - 32 words maximum
  - Uppercase letter
  - Lowercase letter
  - Contain number
  - Doesn't contain spaces
  `) 

  const createUser = models.Users.create({
    username: req.body.username,
    password: hashedPassword,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    profile_photo: req.body.profile_photo,
    email: req.body.email
  });

  createUser.then((data) => {
    res.json({
      message:"A user has been created successfully",
      data: data
    });
  }).catch((error) => {
    res.status(500).send(error.message);
  });
}

const loginController = (req, res) => {
  const token = res.locals.token;
  res.json({
    message: "Logged in successfully",
    token: token
  });
}

const logoutController = (req, res) => {
  try {
    const authHeader = req.headers["authorization"].split(" ")[1];
    const auth = jwt_decode(authHeader);
    const logout = deleteToken(auth.username);

    if (logout) res.json({
      message: "Goodbye!",
      token: logout
    });
  } catch (error) {
    res.status(500).send(error.message);
  }

}

const changePasswordController = async (req, res) => {
  const authHeader = req.headers["authorization"].split(" ")[1];
  const auth = jwt_decode(authHeader);
  const newPassword = req.body.newPassword;
  const confirmPassword = req.body.confirmPassword;
  const hashedPassword = hashPassword(newPassword);
  const token = deleteToken(auth.username);
  
  // Check if old password match with the database
  const data = await User.findOne({where: {username: auth.username}});
  const isPasswordMatch = bcrypt.compareSync(req.body.currentPassword, data.password);
  if (!isPasswordMatch) return res.status(400).send('Wrong current password, please try again');

  // Check if new password is equal with confirmPassword
  if (newPassword != confirmPassword) return res.status(400).send('Password is not match');
  const updatePassword = await User.update({password: hashedPassword}, {where: {username: auth.username}});
  
  try {
    res.json({
      message: "Password has successfully updated",
      token: token
    }); 
  } catch (error) {
    res.status(400).send(error.message);
  }
  
}

const getUserProfile = async (req, res) => {
  const authHeader = req.headers["authorization"].split(" ")[1];
  const auth = jwt_decode(authHeader);
  const data = await User.findOne({where: {username: auth.username}});

  try {
    res.json({
      message: "Get profile success",
      data: data
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
}

const updateProfileController = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"].split(" ")[1];
    const auth = jwt_decode(authHeader);
    const updateProfile = await User.update({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      profile_photo: req.body.profile_photo,
      email: req.body.email
    }, {where: {username: auth.username}});

    res.json({
      message: "Profile successfully updated",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const deleteAccountController = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"].split(" ")[1];
    const auth = jwt_decode(authHeader);
    const token = deleteToken(auth.username);

    const deleteProfile = await User.destroy({where: {username: auth.username}});
    
    res.json({
      message: "Your account has successfully deleted",
      token: token
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

const getOtherUserProfile = async (req, res) => {
  const data = await models.sequelize.query(`
  SELECT username, firstName, lastName, profile_photo FROM Users WHERE username = :username`, 
  {
    type: QueryTypes.SELECT,
    replacements: {
      username: req.params.username
    }
  });

  try {
    res.json({
      message: "Get profile success",
      data: data
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
}


module.exports = {
  signUpController, 
  loginController, 
  logoutController, 
  changePasswordController, 
  getUserProfile, 
  updateProfileController,
  deleteAccountController,
  getOtherUserProfile
};