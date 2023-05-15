const express = require('express');
const { getConversations, getConversationById} = require('../controllers/chatController');
const { sendMessage, deleteMessage, filterMessaging } = require('../controllers/messageController');
const { multimediaMessaging } = require('../middleware/multimediaMessaging');
const { authenticateUser } = require('../middleware/authorization');
const { createConversation } = require('../middleware/createConversation');
const { handleFileSizeLimitExceeded } = require('../middleware/fileSizeLimit');
const { getMultimediaMessages, showMultimediaMessage } = require('../controllers/multimediaMessagingController');
const router = express.Router();

router.get('/chats', authenticateUser, getConversations);
router.get('/chats/:id', authenticateUser, getConversationById);
router.get('/chats/:id/search', authenticateUser, filterMessaging);
router.post('/chats', [authenticateUser, multimediaMessaging(), handleFileSizeLimitExceeded, createConversation], sendMessage);
router.delete('/chats/:id/message', authenticateUser, deleteMessage);

router.get('/chats/:id/multimedia', authenticateUser, getMultimediaMessages);
router.get('/chats/:id/multimedia/file', authenticateUser, showMultimediaMessage);



module.exports = router;