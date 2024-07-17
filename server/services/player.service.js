const { Player } = require('../models')
const bcrypt = require('bcrypt')
const { Sequelize } = require('sequelize')
const saltRounds = 12

class PlayerService {
  async create (player) {
    const { username } = player
    let { password } = player
    password = bcrypt.hashSync(password, saltRounds)

    try {
      return await Player.create({ username, password })
    } catch (error) {
      console.log(error)
      new Error(`User creation failed: ${error}`)
    }
  }

  async getPlayer (id) {
    try {
      return await Player.findByPk(id, {
        attributes: { exclude: ['password'] },
      })
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`)
    }
  }

  async findPlayerByUsername (username) {
    try {
      return await Player.findOne({ where: { username: username } })
    } catch (error) {
      console.log(error)
      throw new Error(`Failed to get user by username: ${error.message}`)
    }
  }

  async updatePlayerStat (playerId, defeatedShips, isWon) {
    const player = await this.getPlayer(playerId)

    let updateFields = {
      matchesPlayed: player.matchesPlayed + 1,
      x1cageBoats: player.x1cageBoats + defeatedShips.x1cageBoats,
      x2cageBoats: player.x2cageBoats + defeatedShips.x2cageBoats,
      x3cageBoats: player.x3cageBoats + defeatedShips.x3cageBoats,
      x4cageBoats: player.x4cageBoats + defeatedShips.x4cageBoats,
    }

    if (isWon) {
      updateFields.matchesWon = player.matchesWon + 1
    }

    try {
      await Player.update(updateFields, { where: { id: playerId } })
      return await this.getPlayer(playerId)
    } catch (error) {
      throw new Error(`Failed to update player stats: ${error.message}`)
    }
  }

  async getStatistics (playerId) {
    const player = await this.getPlayer(playerId)
    if (player === null) {
      throw new Error('Player not found')
    }

    const shipsDestroyed = player.x1cageBoats + player.x2cageBoats +
      player.x3cageBoats + player.x4cageBoats

    let winRate = 0
    if (player.matchesPlayed > 0) {
      winRate = Math.round((player.matchesWon / player.matchesPlayed) * 100)
    }

    return {
      shipsDestroyed: shipsDestroyed,
      x4cage: player.x4cageBoats,
      x3cage: player.x3cageBoats,
      x2cage: player.x2cageBoats,
      x1cage: player.x1cageBoats,
      gamesPlayed: player.matchesPlayed,
      winRate: winRate,
    }
  }

  async getTopPlayers (limit, matchesLimit) {
    try {
      return await Player.findAll({
        attributes: [
          'username',
          [
            Sequelize.literal(
              'ROUND((matchesWon * 1.0 / matchesPlayed) * 100, 0)'), 'winRate'],
          'matchesPlayed',
        ],
        where: {
          matchesPlayed: { [Sequelize.Op.gte]: matchesLimit },
        },
        order: [
          [Sequelize.literal('winRate'), 'DESC'],
        ],
        limit: limit,
        raw: true,
      })
    } catch (error) {
      throw new Error(`Failed to get top players: ${error.message}`)
    }
  }
}

module.exports = PlayerService