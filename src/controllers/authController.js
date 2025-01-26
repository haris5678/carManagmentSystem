const { generateAuthToken } = require("../../helper/auth");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");

const bcrypt = require("bcrypt");
const { sendEmail } = require("../../helper/sendEmail");
const registerUser = async (req, res) => {
  try {
    const { email, firstName, lastName, phone_no } = req.body;
    let { role } = req.body;

    if (!role) {
      role = "user";
    }

    // Validate role
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({
        message:
          "Invalid role specified. Role must be either 'admin' or 'user'.",
      });
    }

    const randomPassword =
      Math.random().toString(36).substring(2, 10) +
      ((Math.random() * 1000000000) | 0);
    const password = randomPassword;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const emailSent = await sendEmail(
      req.body.email,
      "Login Password Reset",
      `Your new password is ${randomPassword}`
    );
    console.log("sent email is : ", emailSent);
    user = new User({
      email,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      phone_no,
    });

    await user.save();

    res
      .status(201)
      .json({ message: "User registered successfully", password: password });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "user not found with this email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await generateAuthToken(user);
    console.log("token is ", token);

    res.status(200).json({
      message: "User logged in successfully",
      user,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const randomPassword =
      Math.random().toString(36).substring(2, 10) +
      ((Math.random() * 1000000000) | 0);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    user.password = hashedPassword;
    const userSaved = await user.save();

    if (userSaved) {
      const emailSent = await sendEmail(
        req.body.email,
        "Login Password Reset",
        `Your new password is ${randomPassword}`
      );
      console.log("sent email is : ", emailSent);
      const isMessageSent = true;

      if (isMessageSent) {
        return res.status(201).json({
          status: "success",
          message: "Email reset password sent",
          test: randomPassword,
          emailSent,
        });
      } else {
        return res.status(500).json({
          status: "fail",
          message: "Failed to send password reset email",
        });
      }
    }

    const resetToken = await generateAuthToken(user);

    res.status(200).json({
      message: "Password sent to your email successfully",
      user,
      token: resetToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  registerUser,
  logIn,
  forgotPassword,
};
