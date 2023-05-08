const models = require('../models/index');
const jwt_decode = require('jwt-decode');
const Conversation = models.Conversations;


const createConversation = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"].split(" ")[1];
    const auth = jwt_decode(authHeader);
    const senderConversation = await Conversation.findOne({where: {
      sender_id: auth.id, 
      receiver_id: req.body.receiver_id
    }});

    const receiverConversation = await Conversation.findOne({where: {
      sender_id: req.body.receiver_id, 
      receiver_id: auth.id
    }});

    if (!senderConversation) await Conversation.create({
      sender_id: auth.id,
      receiver_id: req.body.receiver_id
    });

    if (!receiverConversation) await Conversation.create({
      sender_id: req.body.receiver_id, 
      receiver_id: auth.id
    });

    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports = {
  createConversation: createConversation
}