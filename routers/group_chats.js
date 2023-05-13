const express = require('express');
const { createGroupChat, getMembers, addMember, getGroupChats, addRole, deleteMember } = require('../controllers/groupChatController');
const { authenticateUser } = require('../middleware/authorization');
const { sendMessageToGroup, deleteMessageFromGroup } = require('../controllers/messageController');
const { multimediaMessaging } = require('../middleware/multimediaMessaging');
const router = express.Router();

router.post('/create-group', authenticateUser, createGroupChat);
router.get('/group/:id/members', authenticateUser, getMembers);
router.post('/group/:id/members/add/:user_id', authenticateUser, addMember);
router.patch('/group/:id/members/role/:user_id', authenticateUser, addRole);
router.delete('/group/:id/members/:user_id', authenticateUser, deleteMember);
router.get('/group/:id/chats', authenticateUser, getGroupChats);
router.post('/group/:id/chats', [authenticateUser, multimediaMessaging()], sendMessageToGroup);
router.delete('/group/:id/chats', authenticateUser, deleteMessageFromGroup);

module.exports = router;

