const Car = require("../models/carModel");

const addCar = async (req, res) => {
  const curretUser = req.user_id;
  try {
    const { category, color, model, make, registrationNo, yearOfManufacture } =
      req.body;

    const existingCar = await Car.findOne({ registrationNo });
    if (existingCar) {
      return res
        .status(400)
        .json({ message: "Car with this registration number already exists" });
    }

    const car = new Car({
      category,
      color,
      model,
      make,
      registrationNo,
      yearOfManufacture,
      createdBy: curretUser,
    });

    await car.save();
    res.status(201).json({ message: "Car added successfully", car: car });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Car creation error", error: error.message });
  }
};

const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate("category", "name")
      .populate({ path: "createdBy", select: "email firstName phone_no" });

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Fetch car error", error: error.message });
  }
};

const getAllCars = async (req, res) => {
  try {
    const { page = 1, limit = 10, make, model, category, year } = req.query;

    const query = {
      isDeleted: false,
    };

    if (category) query.category = { $regex: new RegExp(category, "i") };
    if (make) query.make = { $regex: new RegExp(make, "i") };
    if (model) query.model = { $regex: new RegExp(model, "i") };
    if (year) query.yearOfManufacture = parseInt(year);

    console.log(query);

    const cars = await Car.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("category", "name")
      .populate({ path: "createdBy", select: "email firstName phone_no" });

    const total = await Car.countDocuments(query);

    res.json({
      cars,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Fetch cars error", error: error.message });
  }
};

const getAllUsersCars = async (req, res) => {
  const currentUser = req.user_id;
  try {
    const { page = 1, limit = 10, make, model, category, year } = req.query;

    const query = {
      createdBy: currentUser,
      isDeleted: false,
    };

    if (category) query.category = { $regex: new RegExp(category, "i") };
    if (make) query.make = { $regex: new RegExp(make, "i") };
    if (model) query.model = { $regex: new RegExp(model, "i") };
    if (year) query.yearOfManufacture = parseInt(year);

    console.log(query);

    const cars = await Car.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("category", "name")
      .populate({ path: "createdBy", select: "email firstName phone_no" });

    const total = await Car.countDocuments(query);

    res.json({
      cars,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Fetch cars error", error: error.message });
  }
};

const deleteCar = async (req, res) => {
  const currentUser = req.user_id;
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "car not found" });
    }

    if (car.createdBy.toString() !== currentUser) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this category" });
    }

    // const deletedCar = await Car.findOneAndDelete({
    //   _id: req.params.id,
    //   createdBy: currentUser,
    // });
    car.isDeleted = true;
    const deletedCar = await car.save();

    if (!car) {
      return res.status(404).json({
        message: "Car not found or unauthorized",
        deletedCar: deletedCar,
      });
    }

    res.json({ message: "Car deleted successfully", car: deletedCar });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Car deletion error", error: error.message });
  }
};

const updateCar = async (req, res) => {
  const currentUser = req.user_id;
  try {
    const { category, color, model, make, registrationNo, yearOfManufacture } =
      req.body;

    const isCar = await Car.findById(req.params.id);
    if (!isCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (isCar.createdBy.toString() !== currentUser) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this car" });
    }

    const updatedCar = await Car.findOneAndUpdate(
      { _id: req.params.id, createdBy: currentUser },
      {
        category,
        color,
        model,
        make,
        registrationNo,
        yearOfManufacture,
      },
      { new: true, runValidators: true }
    ).populate("category", "name");

    res.json({ message: "Car updated successfully", car: updatedCar });
  } catch (error) {
    res.status(500).json({ message: "Car update error", error: error.message });
  }
};

module.exports = {
  addCar,
  getCarById,
  getAllCars,
  getAllUsersCars,
  deleteCar,
  updateCar,
};
