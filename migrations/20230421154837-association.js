'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('Conversations', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'conversations_association',
      references: {
        table: 'Users',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Messages', {
      fields: ['sender_id'],
      type: 'foreign key',
      name: 'message_sender_association',
      references: {
        table: 'Users',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Messages', {
      fields: ['receiver_id'],
      type: 'foreign key',
      name: 'message_receiver_association',
      references: {
        table: 'Users',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Messages', {
      fields: ['conversation_id'],
      type: 'foreign key',
      name: 'message_conversation_association',
      references: {
        table: 'Conversations',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Group_members', {
      fields: ['group_id'],
      type: 'foreign key',
      name: 'group_members_association',
      references: {
        table: 'Group_chats',
        field: 'id'
      }
    });

    await queryInterface.addConstraint('Group_members', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'user_group_members_association',
      references: {
        table: 'Users',
        field: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('Conversations','conversations_association');
    await queryInterface.removeConstraint('Messages', 'message_sender_association');
    await queryInterface.removeConstraint('Messages', 'message_receiver_association');
    await queryInterface.removeConstraint('Messages', 'message_conversation_association');
  }
};
