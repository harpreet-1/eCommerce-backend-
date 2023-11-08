const express = require("express");
const { addProduct, getProducts } = require("../controllers/productController");

const productRouter = express.Router();

productRouter.route("/").get(getProducts).post(addProduct);

module.exports = productRouter;
