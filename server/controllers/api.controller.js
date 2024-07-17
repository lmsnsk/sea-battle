const PlayerService = require("../services/player.service");
const playerService = new PlayerService();
const GameService = require("../services/game.service");
const gameService = new GameService(playerService);

module.exports = {
  async registerPlayer(req, res) {
    try {
      if (await playerService.findPlayerByUsername(req.body.username)) {
        return res.status(409).send({ error: "User already exists" });
      }
      const player = await playerService.create(req.body);
      res.status(201).send(player);
    } catch (error) {
      res
        .status(400)
        .send({ error: `Failed to create player with cause: ${error}` });
    }
  },

  async getPlayer(req, res) {
    try {
      const player = await playerService.getPlayer(req.params.id);
      if (!player) {
        return res.status(404).send({ error: "Player not found" });
      }
      return res.status(200).send(player);
    } catch (error) {
      res
        .status(400)
        .send({ error: "Failed to get player with cause: " + error });
    }
  },

  async startGame(req, res) {
    try {
      const fields = await gameService.startGame(req, req.body);
      res.status(200).send(fields);
    } catch (error) {
      res.status(400).send({ error: `${error}` });
    }
  },

  async makeMove(req, res) {
    try {
      const { row, col } = req.body;
      const fields = await gameService.makeMove(req, row, col);
      res.status(200).send(fields);
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: `${error}` });
    }
  },

  async getPlayerStatistics(req, res) {
    try {
      const stat = await playerService.getStatistics(req.params.id);

      res.status(200).send(stat);
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: `${error}` });
    }
  },

  async getBestPlayers(req, res) {
    try {
      const players = await playerService.getTopPlayers(5, 10);

      res.status(200).send(players);
    } catch (error) {
      console.error(error);
      res.status(400).send({ error: `${error.message}` });
    }
  },

  async disconnectGame(req, res) {
    try {
      await gameService.disconnectGame(req);

      res.status(200).send(true);
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: `${error}` });
    }
  },
};
