const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: process.env.DB_NAME,
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("db connected successfully");
  })
  .catch((err) => {
    console.log("db connection error", err.message);
  });