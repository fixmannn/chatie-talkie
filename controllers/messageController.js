const models = require('../models/index');
const jwt_decode = require('jwt-decode');

// Models
const User = models.Users;
const Conversation = models.Conversations;
const Message = models.Messages;
const Group_messages = models.Group_messages;
const Group_members = models.Group_members;
const currentTime = new Date();


const sendMessage = async (req, res) => {
  try {
    const authHeader = req.headers.authorization.split(" ")[1];
    const auth = jwt_decode(authHeader);

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

const sendMessageToGroup = async (req, res) => {
  try {
    const authHeader = req.headers.authorization.split(" ")[1];
    const auth = jwt_decode(authHeader);

    // Check if a user is a member of this group
    const group = await Group_members.findOne({where: {
      group_id: req.params.id,
      user_id: auth.id
    }});

    if (group == null) return res.status(401).send('Only member of this group can send messages');

    const newMessage = await Group_messages.create({
      group_id: req.params.id,
      sender_id: auth.id,
      content: req.body.content || req.file.path,
      timestamp: currentTime
    });

    res.json({
      message: "New message has successfully sent!",
      data: newMessage
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports = {sendMessage, sendMessageToGroup};