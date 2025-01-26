const { Router } = require("express");

const userController = require("../controllers/userController");
const {  verifyAuthToken } = require("../../helper/auth");

const router = Router();

router.get("/get-profile", verifyAuthToken(), userController.getProfile);
router.patch("/update-profile", verifyAuthToken(), userController.updateProfile);


// router.get("/get-dsahboard", verifyAuthToken(), userController.getDashboard);

module.exports = router;