//(^_^)=======================    Add new  Product       =========================

const ProductModel = require("../Models/Product");

const getProducts = async (req, res) => {
  try {
    let filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await ProductModel.find(filter);

    res.status(200).json(products);
  } catch (error) {
    console.error("errror from retrieving products ", error);

    res.status(500).json({ error: "Error from retrieving products" });
  }
};

const addProduct = async (req, res) => {
  try {
    const { title, description, price, image, category, stockQuantity } =
      req.body;
    const isAvailable = await ProductModel.findOne({ title });

    if (isAvailable) {
      return res.status(400).json({
        status: false,
        message: "Product is alredy in store",
      });
    }

    const product = await ProductModel.create({
      title,
      description,
      price,
      image,
      category,
      stockQuantity,
    });

    res
      .status(200)
      .json({ status: true, message: "product added successfully", product });
  } catch (error) {
    console.log("error from add product \n", error);
    res.status(500).json({
      status: false,
      message: "something went wrong , Please try again later",
    });
  }
};

module.exports = { addProduct, getProducts };
