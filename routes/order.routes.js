const express = require("express");
const {
  placeOrder,
  getOrderHistory,
  getSingleOrderDetails,
} = require("../controllers/orderController");
const authorization = require("../middlewares/auth");

const orderRouter = express.Router();

// Authentication

orderRouter.use(authorization);

orderRouter.post("/place", placeOrder);
orderRouter.get("/history", getOrderHistory);
orderRouter.get("/detail/:id", getSingleOrderDetails);

module.exports = orderRouter;
