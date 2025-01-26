const { Router } = require("express");

const categoryController = require("../controllers/categoryController");
const { verifyAuthToken, validateCategory } = require("../../helper/auth");

const router = Router();

router.post(
  "/create-category",validateCategory,
  verifyAuthToken(),
  categoryController.createCategory
);

router.get(
    "/get-all-category",
    verifyAuthToken(),
    categoryController.getAllCategories
  );


  router.get(
    "/get-category-by-Id/:id",
    verifyAuthToken(),
    categoryController.getCategoryById
  );


  router.patch(
    "/update-category/:id",
    verifyAuthToken(),
    categoryController.updateCategory
  );


  router.delete(
    "/delete-category/:id",
    verifyAuthToken(),
    categoryController.deleteCategory
  );

module.exports = router;
