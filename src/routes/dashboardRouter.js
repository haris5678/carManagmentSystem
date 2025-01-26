const { Router } = require("express");

const dashboardController = require("../controllers/dashboardController");
const {  verifyAuthToken } = require("../../helper/auth");

const router = Router();

router.get("/get-admin-dsahboard", verifyAuthToken(), dashboardController.getAdminDashboard);
router.get("/get-user-dsahboard", verifyAuthToken(), dashboardController.getUserDashboard);

module.exports = router;