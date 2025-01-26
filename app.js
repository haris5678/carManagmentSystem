const express = require("express");
const dotenv = require("dotenv");
const httpErrors = require("http-errors");
const morgan = require("morgan");
const authRoutes = require("./src/routes/authRouter");
const categoryRoutes = require("./src/routes/categoryRouter");
const carRoutes = require("./src/routes/carRouter");
const dashboardRoutes = require("./src/routes/dashboardRouter");
const userRoutes = require("./src/routes/userRouter");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();
require("./helper/init_mongodb");

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/car", carRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(async (req, res, next) => {
  next(httpErrors.NotFound());
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
