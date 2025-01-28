const { default: mongoose } = require("mongoose");
const Car = require("../models/carModel");
const Category = require("../models/categoryModel");
const User = require("../models/userModel");
const getPipeline = require("../../helper/userDashboardPipeline");

const getAdminDashboard = async (req, res) => {
  const currentUser = req.user_id;
  try {
    const user = await User.findById({
      _id: currentUser,
      isDeleted: false,
    }).select("-password");
    if (user.role !== "admin" || !user) {
      return res.status(404).json({ message: "admin not found" });
    }
    const totalCars = await Car.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
      message: "Dashboard data",
      totalCars,
      totalCategories,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard error", error: error.message });
  }
};

const getUserDashboard = async (req, res) => {
  const currentUser = req.user_id;
  try {
    const user = await User.findById(currentUser).select("-password");
    if (user.role !== "user" || !user) {
      return res.status(404).json({ message: "user not found" });
    }

    const pipeline = getPipeline(currentUser);
    const carsByCategory = await Car.aggregate(pipeline);

    console.log("carsByCategory is ", carsByCategory);

    res.json({
      message: "Dashboard data",
      totalCars: carsByCategory.reduce((acc, cat) => acc + cat.total, 0), // Total cars
      carsByCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Dashboard error", error: error.message });
  }
};

module.exports = { getAdminDashboard, getUserDashboard };
