'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      matchesPlayed: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      matchesWon: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      x1cageBoats: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      x2cageBoats: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      x3cageBoats: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      x4cageBoats: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Players')
  },
}