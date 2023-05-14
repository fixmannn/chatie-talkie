const models = require('../models/index');
const jwt_decode = require('jwt-decode');
const {QueryTypes} = require('sequelize');

// Models
const Conversation = models.Conversations;
const Message = models.Messages;
const Group_messages = models.Group_messages;
const Group_members = models.Group_members;
const currentTime = new Date();


const sendMessage = async (req, res) => {
  try {
    const authHeader = req.headers.authorization.split(" ")[1];
    const auth = jwt_decode(authHeader);
    const conversation = await Conversation.findOne({where: {
      sender_id: auth.id,
      receiver_id: req.body.receiver_id
    }});
    
    const newMessage = await Message.create({
      sender_id: auth.id,
      receiver_id: req.body.receiver_id,
      conversation_id: conversation.id,
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

const deleteMessage = async (req, res) => {
  try {
    const authHeader = req.headers.authorization.split(" ")[1];
    const auth = jwt_decode(authHeader);

    const message = await Message.findOne({where: {
      sender_id: auth.id,
      id: req.query.id
    }});

    if (!message) return res.status(404).send('Message not found');

    await Message.destroy({
      where: {
        sender_id: auth.id,
        id: req.query.id
      }
    });

    res.json({
      message: 'Message has successfully deleted'
    })

  } catch (error) {
    res.status(400).send(error.message);
  }
}

const deleteMessageFromGroup = async (req, res) => {
  try {
    const authHeader = req.headers.authorization.split(" ")[1];
    const auth = jwt_decode(authHeader);

    const group_message = await Group_messages.findOne({where: {
      sender_id: auth.id,
      id: req.query.message_id
    }});

    if (!group_message) return res.status(404).send('Message not found');

    await Group_messages.destroy({
      where: {
        sender_id: auth.id,
        id: req.query.message_id
      }
    });

    res.json({
      message: 'Message has successfully deleted'
    })

  } catch (error) {
    res.status(400).send(error.message);
  }
}

const filterMessaging = async (req, res) => {
  try {
    const authHeader = req.headers.authorization.split(" ")[1];
    const auth = jwt_decode(authHeader);

    const data = await models.sequelize.query(`
    SELECT content, timestamp FROM Messages WHERE sender_id = :authId AND receiver_id = :reqId AND content LIKE '%${req.query.message}%'
    OR sender_id = :reqId AND receiver_id = :authId AND content LIKE '%${req.query.message}%'
    ORDER BY timestamp ASC`, 
    {
      type: QueryTypes.SELECT,
      replacements: {
        authId: auth.id, 
        reqId: req.params.id
      }
    });

    res.json({
      message: 'Filter message successfully',
      data: data
    })
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports = {sendMessage, sendMessageToGroup, deleteMessage, deleteMessageFromGroup, filterMessaging};