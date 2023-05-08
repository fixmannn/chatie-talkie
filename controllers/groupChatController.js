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
      user_id: req.params.user_id
    }});

    if (!members) return res.status(404).send('Group not found');
    if (members.role == 'member') return res.status(401).send('Only admin can add new member');
    if (memberExist) return res.status(400).send('This user is a member of this group already');

    const addMember = await Group_members.create({
      group_id: req.params.id,
      user_id: req.params.user_id,
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

const addRole = async (req, res) => {
  try {
    // Check if the user is member of the group and the role is admin
    const authHeader = req.headers["authorization"].split(" ")[1];
    const auth = jwt_decode(authHeader);
    const members = await Group_members.findOne({where: {
      group_id: req.params.id,
      user_id: auth.id
    }});


    if (!members) return res.status(404).send('Group not found or you\'re not member of this group');
    if (members.role == 'member') return res.status(401).send('Only admin can set role to member');

    const setAdmin = await Group_members.update({role: req.body.role}, 
      {where: {
        user_id: req.params.user_id
      }});

    res.json({
      message: "Member set as admin"
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

const deleteMember = async (req, res) => {
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
      user_id: req.params.user_id
    }});

    if (!members) return res.status(404).send('Group not found');
    if (members.role != 'owner' && memberExist.role == 'owner') return res.status(401).send('You can kick the owner of the group');
    if (!memberExist) return res.status(404).send('This member is not a participant');
    if (members.role == 'member') return res.status(401).send('Only admin or group owner who can kick the member');

    const deleteMember = await Group_members.destroy({where: {
      user_id: req.params.user_id
    }});

    res.json({
      message: "Member kicked successfully"
    })
  } catch (error) {
    res.status(400).send(error.message);
  }
  


  

}

module.exports = {
  createGroupChat,
  getMembers,
  addMember,
  addRole,
  getGroupChats,
  deleteMember
}