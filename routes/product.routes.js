const express = require("express");
const {
  addProduct,
  getProducts,
  getProductDetails,
} = require("../controllers/productController");

const productRouter = express.Router();

productRouter.route("/").get(getProducts).post(addProduct);

productRouter.get("/:id", getProductDetails);

module.exports = productRouter;
