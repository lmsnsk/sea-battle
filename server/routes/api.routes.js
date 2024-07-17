const { Router } = require("express");
const controller = require("../controllers/api.controller.js");
// const checkAuthenticated = require('../middleware/auth.middleware')

const apiPrefix = "/api/v1";
const router = Router();

router.post("/players", controller.registerPlayer);
router.get("/players/best", controller.getBestPlayers);
router.get("/players/:id", controller.getPlayer);
router.get("/players/:id/stat", controller.getPlayerStatistics);
router.post("/games/start", controller.startGame);
router.post("/games/move", controller.makeMove);
router.get("/games/disconnect", controller.disconnectGame);

const apiRouter = Router();
apiRouter.use(apiPrefix, router);

module.exports = apiRouter;
