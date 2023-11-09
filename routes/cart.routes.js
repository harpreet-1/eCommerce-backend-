const express = require("express");

const {
  addToCart,
  viewCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

const authorization = require("../middlewares/auth");

const cartRouter = express.Router();

// Authentication

cartRouter.use(authorization);

cartRouter.get("/", viewCart);
cartRouter.post("/add/:productId", addToCart);
cartRouter.patch("/update/:cartId", updateCartItem);
cartRouter.delete("/remove/:cartId", removeCartItem);

module.exports = cartRouter;
