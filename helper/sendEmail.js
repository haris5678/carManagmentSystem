const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: "testingi180608@gmail.com",
      to: email,
      subject: subject,
      text: html,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.response);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
};

module.exports = { sendEmail };
