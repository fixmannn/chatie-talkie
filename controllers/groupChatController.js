const jwt_decode = require('jwt-decode');
const models = require('../models/index');
const Group_chats = models.Group_chats;
const Group_members = models.Group_members;
const Group_messages = models.Group_messages;
const {QueryTypes} = require('sequelize');
const currentTime = new Date();

const createGroupChat = async(req, res) => {
  try {
    const authHeader = req.headers["authorization"].split(" ")[1];
    const auth = jwt_decode(authHeader);
    const group_chats = await Group_chats.create({
      name: req.body.name,
      description: req.body.description,
      profile_photo: req.body.profile_photo,
      createdBy: auth.id,
      createdAt: currentTime
    });

    if (group_chats) await Group_members.create({
      group_id: group_chats.id,
      user_id: auth.id,
      join_date: currentTime,
      role: "admin"
    });

    res.json({
      message: "Group created successfully"
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const addMember = async (req, res) => {
  try {
    // Check if the user is member of the group and the role is admin
    const authHeader = req.headers["authorization"].split(" ")[1];
    const auth = jwt_decode(authHeader);
    const members = await Group_members.findOne({where: {
      group_id: req.params.id,
      user_id: auth.id
    }});

    const memberExist = await Group_members.findOne({where: {
      group_id: req.params.id,
      user_id: req.body.user_id
    }});

    if (members.length === 0) return res.status(404).send('Group not found');
    if (members.role != "admin") return res.status(401).send('Only admin can add new member');
    if (memberExist) return res.status(400).send('This user is a member of this group already');

    const addMember = await Group_members.create({
      group_id: req.params.id,
      user_id: req.body.user_id,
      join_date: currentTime,
      role: "member"
    });

    res.json({
      message: "New member added successfully",
      data: addMember
    })
    
  } catch (error) {
    res.status(400).send(error.message);
  }
}

const getMembers = async (req, res) => {
  const getMembers = await Group_members.findAll({where: {
    group_id: req.params.id
  }});

  res.json({
    data: getMembers
  });
}

const getGroupChats = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"].split(" ")[1];
    const auth = jwt_decode(authHeader);
    // Check if the user is a member of the group
    const group = await Group_members.findOne({where: {
      group_id: req.params.id,
      user_id: auth.id
    }});
    
    if (group == null) return res.status(401).send('Only participant can see the conversation of this group');
    
    const groupChats = await Group_messages.findAll({where: {group_id: req.params.id}});
    if (groupChats.length === 0) return res.status(401).send('No conversation yet');

    res.json({
      message: "Get group chats successfully",
      data: groupChats
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
}

module.exports = {
  createGroupChat,
  getMembers,
  addMember,
  getGroupChats
}