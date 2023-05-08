const express = require('express');
const { getConversations, getConversationById, getMultimediaMessages, deleteConversationById} = require('../controllers/chatController');
const { sendMessage, deleteMessage } = require('../controllers/messageController');
const { multimediaMessaging } = require('../middleware/multimediaMessaging');
const { authenticateUser } = require('../middleware/authorization');
const { createConversation } = require('../middleware/createConversation');
const { handleFileSizeLimitExceeded } = require('../middleware/fileSizeLimit');
const router = express.Router();

router.get('/chats', authenticateUser, getConversations);
router.get('/chats/:id', authenticateUser, getConversationById);
router.delete('/chats/:id', authenticateUser, deleteConversationById);
router.get('/chats/:id/multimedia', authenticateUser, getMultimediaMessages);
router.post('/chats', [authenticateUser, multimediaMessaging(), handleFileSizeLimitExceeded, createConversation], sendMessage);
router.delete('/chats/:id/message', authenticateUser, deleteMessage);

module.exports = router;