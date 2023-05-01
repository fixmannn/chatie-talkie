const express = require('express');
const { createGroupChat, getMembers, addMember, getGroupChats } = require('../controllers/groupChatController');
const { authenticateUser } = require('../middleware/authorization');
const { sendMessageToGroup } = require('../controllers/messageController');
const { multimediaMessaging } = require('../middleware/multimediaMessaging');
const router = express.Router();

router.post('/create-group', authenticateUser, createGroupChat);
router.get('/group/:id/members', authenticateUser, getMembers);
router.post('/group/:id/add-member', authenticateUser, addMember);
router.get('/group/:id/chats', authenticateUser, getGroupChats);
router.post('/group/:id/chats', [authenticateUser, multimediaMessaging()], sendMessageToGroup);

module.exports = router;

