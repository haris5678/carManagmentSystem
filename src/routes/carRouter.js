const { Router } = require("express");

const carController = require("../controllers/carController");
const { verifyAuthToken, validateCar } = require("../../helper/auth");

const router = Router();

router.post(
  "/add-car",validateCar,
  verifyAuthToken(),
  carController.addCar
);

router.get(
    "/get-all-cars",
    verifyAuthToken(),
    carController.getAllCars
  );


  router.get(
    "/get-car-by-Id/:id",
    verifyAuthToken(),
    carController.getCarById
  );


  router.patch(
    "/update-car/:id",
    verifyAuthToken(),
    carController.updateCar
  );


  router.delete(
    "/delete-car/:id",
    verifyAuthToken(),
    carController.deleteCar
  );

module.exports = router;
