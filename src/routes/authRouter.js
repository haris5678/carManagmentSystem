const { Router } = require("express");

const authController = require("../controllers/authController");
const { validateSignup, verifyAuthToken } = require("../../helper/auth");

const router = Router();

router.post("/signup", validateSignup, authController.registerUser);
router.post("/login", authController.logIn);
router.post("/forgot-password", authController.forgotPassword);

module.exports = router;
