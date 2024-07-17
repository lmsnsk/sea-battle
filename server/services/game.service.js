const { Ship } = require("../classes/ship");
const { Battlefield } = require("../classes/battlefield");
let pcShips = [];

class GameService {
  battleFieldSize;

  constructor(playerService) {
    this.battleFieldSize = 10;
    this.playerService = playerService;
  }

  createEmptyPcShips() {
    pcShips = [
      new Ship(4),
      new Ship(3),
      new Ship(3),
      new Ship(2),
      new Ship(2),
      new Ship(2),
      new Ship(1),
      new Ship(1),
      new Ship(1),
      new Ship(1),
    ];
  }

  async startGame(req, ships) {
    if (req.session.game) {
      throw new Error("Session is already started");
    }

    const playerBattlefield = new Battlefield(this.battleFieldSize);
    if (Array.isArray(ships)) {
      playerBattlefield.placeShips(ships);
    } else {
      playerBattlefield.randomPlaceShips(pcShips);
    }

    const pcBattlefield = new Battlefield(this.battleFieldSize);
    this.createEmptyPcShips();
    pcBattlefield.randomPlaceShips(pcShips);

    req.session.game = {
      playerField: playerBattlefield.field,
      playerShips: playerBattlefield.ships,
      pcField: pcBattlefield.field,
      pcShips: pcBattlefield.ships,
      x1cageBoats: 0,
      x2cageBoats: 0,
      x3cageBoats: 0,
      x4cageBoats: 0,
    };

    pcBattlefield.hideShips();
    return { playerBattlefield, pcBattlefield };
  }

  async makeMove(req, row, col) {
    const game = req.session.game;
    let isPcHit;

    if (!game) {
      throw new Error("Game not started");
    }

    const playerBattlefield = this.restoreBattlefield(
      game.playerField,
      game.playerShips
    );
    const pcBattlefield = this.restoreBattlefield(game.pcField, game.pcShips);

    const resultShot = pcBattlefield.takeShot(row, col);

    this.processingResultShot(game, resultShot.resultShot);

    let winner = null;
    let pcShot = null;

    if (this.isAllShipsAreSunk(pcBattlefield.ships)) {
      await this.finalizeGame(req, true);
      winner = "PLAYER";
    } else {
      if (!resultShot.hit) {
        do {
          const { pcRow, pcCol } = this.pcTurn(playerBattlefield);
          console.log(`PC take a shot:\n row: ${pcRow} \n col: ${pcCol}`);
          isPcHit = playerBattlefield.takeShot(pcRow, pcCol).hit;
          pcShot = { row: pcRow, col: pcCol };

          if (this.isAllShipsAreSunk(playerBattlefield.ships)) {
            await this.finalizeGame(req, false);
            isPcHit = false;
            winner = "PC";
          }
        } while (isPcHit);
      }
    }

    game.pcField = pcBattlefield.field;
    game.playerField = playerBattlefield.field;

    pcBattlefield.hideShips();
    return {
      playerBattlefield,
      pcBattlefield,
      winner,
      pcShot,
    };
  }

  processingResultShot(game, resultShot) {
    switch (resultShot) {
      case 1:
        game.x1cageBoats += 1;
        break;
      case 2:
        game.x2cageBoats += 1;
        break;
      case 3:
        game.x3cageBoats += 1;
        break;
      case 4:
        game.x4cageBoats += 1;
        break;
      default:
        break;
    }
  }

  isAllShipsAreSunk(ships) {
    return ships.every((ship) => ship.isSunk === true);
  }

  pcTurn(playerBattlefield) {
    const size = playerBattlefield.size;
    const availableShots = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (!playerBattlefield.isMissOrHit(row, col)) {
          availableShots.push({ pcRow: row, pcCol: col });
        }
      }
    }

    if (availableShots.length === 0) {
      throw new Error("No available shots");
    }

    const shotIndex = Math.floor(Math.random() * availableShots.length);
    return availableShots[shotIndex];
  }

  async finalizeGame(req, isWon) {
    if (!req.session || !req.session.game) {
      throw new Error("No game in session");
    }

    const playerId = req.session.player.id;
    const { x1cageBoats, x2cageBoats, x3cageBoats, x4cageBoats } =
      req.session.game;

    const defeatedShips = {
      x1cageBoats,
      x2cageBoats,
      x3cageBoats,
      x4cageBoats,
    };
    try {
      await this.playerService.updatePlayerStat(playerId, defeatedShips, isWon);
    } catch (error) {
      console.error("Failed to update player stats:", error);
      throw new Error("Failed to finalize game");
    }
    delete req.session.game;
  }

  async disconnectGame(req) {
    return await this.finalizeGame(req, false);
  }

  restoreBattlefield(field, ships) {
    const battlefield = new Battlefield(field.length);
    battlefield.field = field;
    battlefield.ships = ships;
    return battlefield;
  }
}

module.exports = GameService;
