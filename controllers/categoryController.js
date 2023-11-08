const CategoryModel = require("../Models/Category");

// ======================= Add new Category =========================

const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "please provide name of category" });
    }

    const isAvailable = await CategoryModel.findOne({ name });

    if (isAvailable) {
      return res.status(400).json({
        status: false,
        message: "Category is alredy available",
      });
    }
    const category = await CategoryModel.create({
      name,
      description: description ? description : "",
    });

    res.status(201).json({
      status: "success",
      message: "Category added successfully",
      category,
    });
  } catch (error) {
    console.error("Error from adding new category:\n", error);

    res.status(500).json({ message: "Error in adding new category" });
  }
};

// ======================= Get category list =========================
const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    res.json({ categories });
  } catch (error) {
    console.error("Error from getting all categories:\n", error);

    res.status(500).json({ message: "Error in getting all categories" });
  }
};

module.exports = { getCategories, addCategory };
