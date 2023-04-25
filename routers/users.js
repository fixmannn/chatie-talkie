const express = require('express');
const { signUpController, loginController, logoutController, changePasswordController, getUserProfile, updateProfileController, deleteAccountController } = require('../controllers/userController');
const { authenticateUser, generateToken} = require('../middleware/authorization');
const router = express.Router();

router.get('/profile', authenticateUser, getUserProfile);
router.post('/signup', signUpController);
router.post('/login', generateToken, loginController);
router.post('/logout', logoutController);
router.patch('/change-password', changePasswordController);
router.patch('/profile/update', updateProfileController);
router.delete('/account/delete', deleteAccountController);

module.exports = router;