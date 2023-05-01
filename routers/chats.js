const express = require('express');
const { getConversations, getConversationById } = require('../controllers/chatController');
const { sendMessage } = require('../controllers/messageController');
const { multimediaMessaging } = require('../middleware/multimediaMessaging');
const { authenticateUser } = require('../middleware/authorization');
const router = express.Router();

router.get('/chats', authenticateUser, getConversations);
router.get('/chats/:id', authenticateUser, getConversationById);
router.post('/chats', [authenticateUser, multimediaMessaging()], sendMessage);

module.exports = router;