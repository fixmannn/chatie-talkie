const models = require('../models/index');
const jwt_decode = require('jwt-decode');
const {QueryTypes} = require('sequelize');

// Get all conversations
const getConversations = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"].split(" ")[1];
    const auth = jwt_decode(authHeader);
    const conversation = await models.sequelize.query(`SELECT * FROM Conversations WHERE sender_id = ${auth.id} OR receiver_id = ${auth.id}`, {type: QueryTypes.SELECT});
    
    if (conversation.length === 0) return res.status(200).send('No conversation yet');
    res.json({
      message: "Get chats successfully",
      data: conversation
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
}

// Get conversation by user id
const getConversationById = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"].split(" ")[1];
    const auth = jwt_decode(authHeader);
    const conversation = await models.sequelize.query(
      `SELECT id FROM Conversations WHERE sender_id = :authId AND receiver_id = :reqId`,
      {
        type: QueryTypes.SELECT,
        replacements: {
          authId: auth.id,
          reqId: req.params.id
        }
      }
    );

    if (conversation.length === 0) return res.status(404).send('No conversation yet');

    const message = await models.sequelize.query(
      `SELECT id, sender_id, receiver_id, content, timestamp 
      FROM Messages 
      WHERE sender_id = :authId AND receiver_id = :reqId 
      OR sender_id = :reqId AND receiver_id = :authId 
      ORDER BY timestamp ASC`, 
      {
        type: QueryTypes.SELECT,
        replacements: { 
          authId: auth.id, 
          reqId: req.params.id 
        }
      }
    );

    if (message.length === 0) return res.status(200).send('No conversation yet');

    res.json({
      message: "Get chat successfully",
      data: message
    });
  } catch (error) {
    res.status(404).send(error.message);
  }
}


module.exports = {
  getConversations,
  getConversationById
}