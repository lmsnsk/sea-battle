const PlayerService = require("../services/player.service");
const playerService = new PlayerService();
const bcrypt = require("bcrypt");

module.exports = {
  async login(req, res) {
    const { username, password } = req.body;

    try {
      const player = await playerService.findPlayerByUsername(username);

      if (!player) {
        return res.status(401).send({ error: "Player does not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, player.password);

      if (isPasswordValid) {
        req.session.player = {
          id: player.id,
          username: player.username,
        };
        req.session.isAuthenticated = true;

        return res.status(200).send({
          id: player.id,
          username: player.username,
        });
      } else {
        return res.status(401).send({ error: "Invalid username or password" });
      }
    } catch (error) {
      console.error(error);
      return res.status(400).send({ error: "Failed to login" });
    }
  },

  async logout(req, res) {
    if (!req.session.player) {
      return res.status(401).send({ error: "You are not logged in!" });
    }
    req.session.destroy();
    return res.status(200).send({ success: true });
  },

  async register(req, res) {
    try {
      if (await playerService.findPlayerByUsername(req.body.username)) {
        return res.status(409).send({ error: "User already exists" });
      }
      const player = await playerService.create(req.body);
      res.status(201).send(player);
    } catch (error) {
      return res.status(400).send({ error: error });
    }
  },

  async checkSession(req, res) {
    if (!req.session || !req.session.player) {
      return res.status(401).send({ error: "You are not logged in!" });
    }
    return res.status(200).send({ success: true });
  },
};
