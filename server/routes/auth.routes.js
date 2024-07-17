const { Router } = require("express");
const controller = require("../controllers/auth.controller.js");

const apiPrefix = "/api/v1";
const router = Router();

router.post("/signin", controller.login);
router.get("/logout", controller.logout);
router.post("/signup", controller.register);
router.get("/session-check", controller.checkSession);

const authRouter = Router();
authRouter.use(apiPrefix, router);

module.exports = authRouter;
