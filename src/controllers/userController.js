const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
  const currentUser = req.user_id;
  const user = await User.findById(currentUser).select("-password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    return res.status(200).json({ message: "User found", user: user });
  }
};

const updateProfile = async (req, res) => {
  const currentUser = req.user_id;
  const allowedUpdates = ["password", "lastName"];
  const actualUpdates = Object.keys(req.body);
  const isValidOperation = actualUpdates.every((field) =>
    allowedUpdates.includes(field)
  );

  if (!isValidOperation) {
    return res.status(400).json({
      message:
        "Update not allowed. You can only update your password and last name.",
    });
  }
  try {
    const user = await User.findById(currentUser).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, lastName } = req.body;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user.password = hashedPassword;
      await user.save();
    }

    if (lastName) {
      user.lastName = lastName;
      await user.save();
    }

    return res.status(200).json({ message: "User updated", user: user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
