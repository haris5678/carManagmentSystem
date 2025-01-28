const Category = require("../models/categoryModel");
const User = require("../models/userModel");

const createCategory = async (req, res) => {
  const currentUser = req.user_id;
  try {
    const user = await User.findById(currentUser);
    if (user.role !== "admin") {
      return res.status(404).json({
        message: "User not authorized to create category only admin can create",
      });
    }
    const { name, description } = req.body;

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({
      name,
      description,
      createdBy: currentUser,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Category creation error", error: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const categories = await Category.find({isDeleted: false})
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate({ path: "createdBy", select: "email firstName" });

    const total = await Category.countDocuments({isDeleted: false});

    res.json({
      message: "Categories fetched successfully",
      categories,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fetch categories error", error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate({
      path: "createdBy",
      select: "email firstName phone_no",
    });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category found", category: category });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fetch category error", error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const currentUser = req.user_id;
  try {
    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.createdBy.toString() !== currentUser.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this category" });
    }

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: req.params.id },
      { name, description },
      { new: true, runValidators: true }
    );

    res.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Category update error", error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const currentUser = req.user_id;
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.createdBy.toString() !== currentUser.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this category" });
    }

    // const deletedCategory = await Category.findOneAndDelete({
    //   _id: req.params.id,
    //   createdBy: currentUser,
    // });

    category.isDeleted = true;
    const deletedCategory = await category.save();

    res.json({
      message: "Category deleted successfully",
      category: deletedCategory,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Category deletion error", error: error.message });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
