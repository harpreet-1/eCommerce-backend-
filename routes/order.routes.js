const express = require("express");
const {
  placeOrder,
  getOrderHistory,
  getSingleOrderDetails,
  singleOrder,
} = require("../controllers/orderController");
const authorization = require("../middlewares/auth");

const orderRouter = express.Router();

// Authentication

orderRouter.use(authorization);

/**
 * @swagger
 * /order/place:
 *   post:
 *     summary: Place an order
 *     description: Place a new order with product items.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               deliveryAddress:
 *                 type: string
 *               deliveryDate:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Order placement failed
 *       500:
 *         description: Error placing the order
 */

orderRouter.post("/place", placeOrder);

/**
 * @swagger
 * /order/single:
 *   post:
 *     summary: Place an order directly (without add in cart)
 *     description: Place a new order with product items.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               deliveryAddress:
 *                 type: string
 *               deliveryDate:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Order placement failed
 *       500:
 *         description: Error placing the order
 */

orderRouter.post("/single", singleOrder);

/**
 * @swagger
 * /order/history:
 *   get:
 *     summary: Get order history
 *     description: Retrieve the order history for the authenticated user.
 *     responses:
 *       200:
 *         description: List of order history
 *       500:
 *         description: Error retrieving order history
 */
orderRouter.get("/history", getOrderHistory);

/**
 * @swagger
 * /order/detail/{id}:
 *   get:
 *     summary: Get single order details
 *     description: Retrieve details of a specific order by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error retrieving order details
 */
orderRouter.get("/detail/:orderId", getSingleOrderDetails);

module.exports = orderRouter;
