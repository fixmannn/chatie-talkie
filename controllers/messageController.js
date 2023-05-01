const models = require('../models/index');
const jwt_decode = require('jwt-decode');

// Models
const User = models.Users;
const Conversation = models.Conversations;
const Message = models.Messages;


const sendMessage = async (req, res) => {
  try {
    const authHeader = req.headers.authorization.split(" ")[1];
    const auth = jwt_decode(authHeader);
    const currentTime = new Date();

    const sender_id = auth.id;
    const receiver_id = req.body.receiver_id;

    const senderConversation = await Conversation.findOne({where: {sender_id, receiver_id}});
    const receiverConversation = await Conversation.findOne({where: {sender_id: receiver_id, receiver_id: sender_id}});

    if (!senderConversation) await Conversation.create({where: {sender_id, receiver_id}});
    if (!receiverConversation) await Conversation.create({where: {sender_id: receiver_id, receiver_id: sender_id}});

    const conversation_id = senderConversation ? senderConversation.id : receiverConversation.id;

    const newMessage = await Message.create({
      sender_id,
      receiver_id,
      conversation_id,
      content: req.body.content || req.file.path,
      timestamp: currentTime
    });

    res.json({message: "New message has successfully sent!", data: newMessage});
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports = {sendMessage};