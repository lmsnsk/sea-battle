'use strict'

const bcrypt = require('bcrypt')
const saltRounds = 10

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Players', [
      {
        username: 'player1',
        password: await bcrypt.hash('1234', saltRounds),
        matchesPlayed: 10,
        matchesWon: 7,
        x1cageBoats: 35,
        x2cageBoats: 24,
        x3cageBoats: 16,
        x4cageBoats: 8,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'player2',
        password: await bcrypt.hash('1234', saltRounds),
        matchesPlayed: 15,
        matchesWon: 10,
        x1cageBoats: 45,
        x2cageBoats: 36,
        x3cageBoats: 20,
        x4cageBoats: 12,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'player3',
        password: await bcrypt.hash('1234', saltRounds),
        matchesPlayed: 20,
        matchesWon: 15,
        x1cageBoats: 63,
        x2cageBoats: 47,
        x3cageBoats: 32,
        x4cageBoats: 16,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Players', null, {})
  },
}
