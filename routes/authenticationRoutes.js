const express = require("express");
const { loginController, refreshTokenController } = require("../controllers/loginController");
const { logoutController } = require("../controllers/logoutController"); 
const verifySession = require("../middlewares/authenticationMiddleware"); 
const router = express.Router();

// Login Routes
router.post("/authenticate", loginController);
router.post("/refresh", refreshTokenController);

// Logout Route requires a valid authentication
router.post("/logout", verifySession, logoutController);

module.exports = router;
