const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  registrationNo: {
    type: String,
    required: true,
    unique: true,
  },
  yearOfManufacture: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Car = mongoose.model("Car", CarSchema);
module.exports = Car;
