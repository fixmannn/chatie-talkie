const models = require('../models/index');
const jwt_decode = require('jwt-decode');
const {QueryTypes} = require('sequelize');
const path = require('path');

const getMultimediaMessages = async (req, res) => {
  const authHeader = req.headers["authorization"].split(" ")[1];
  const auth = jwt_decode(authHeader);
  const data = await models.sequelize.query(`
  SELECT content, timestamp FROM Messages WHERE sender_id = :authId AND receiver_id = :reqId  AND content LIKE '%uploads/%'
  OR sender_id = :reqId AND receiver_id = :authId AND content LIKE '%uploads/%'
  ORDER BY timestamp ASC`, 
  {
    type: QueryTypes.SELECT,
    replacements: {
      authId: auth.id, 
      reqId: req.params.id
    }
  });

  try {
    res.json({
      message: "Get multimedia messages success",
      data: data
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
}

const showMultimediaMessage = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"].split(" ")[1];
    const auth = jwt_decode(authHeader);

    const data = await models.sequelize.query(`
    SELECT content FROM Messages WHERE sender_id = :authId AND receiver_id = :reqId AND content LIKE '%${req.query.content}%'
    OR sender_id = :reqId AND receiver_id = :authId AND content LIKE '%${req.query.content}%'
    ORDER BY timestamp ASC`, 
    {
      type: QueryTypes.SELECT,
      replacements: {
        authId: auth.id, 
        reqId: req.params.id
      }
    });

    // res.send(data[0].content);
    res.sendFile(path.resolve(data[0].content));
  } catch (error) {
    // console.log(data);
    res.status(401).send(error.message);
  }
}

module.exports = {
  getMultimediaMessages,
  showMultimediaMessage
}