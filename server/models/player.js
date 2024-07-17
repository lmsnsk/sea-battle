'use strict'
const {
  Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    static associate (models) {
      // define association here
    }
  }

  Player.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    matchesPlayed: DataTypes.INTEGER,
    matchesWon: DataTypes.INTEGER,
    x1cageBoats: DataTypes.INTEGER,
    x2cageBoats: DataTypes.INTEGER,
    x3cageBoats: DataTypes.INTEGER,
    x4cageBoats: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Player',
  })
  return Player
}