const express = require("express");
const CartModel = require("../Models/Cart");
const OrderModel = require("../Models/Order");
const { default: mongoose } = require("mongoose");
const ProductModel = require("../Models/Product");

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { deliveryAddress, deliveryDate, paymentMethod } = req.body;

    if (!deliveryAddress || !deliveryDate || !paymentMethod) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide required details" });
    }

    // Get user cart items
    const cartItems = await CartModel.find({ userId });

    if (!cartItems.length) {
      return res
        .status(400)
        .json({ success: false, message: "The cart is empty." });
    }

    const orderItems = cartItems.map((cartItem) => ({
      product: cartItem.productId,
      quantity: cartItem.quantity,
    }));

    // Aggregation pipeline to calculate the total amount
    const totalAmountPipeline = [
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          total: {
            $multiply: ["$quantity", "$product.price"],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: "$total",
          },
        },
      },
    ];

    const [orderTotalAmountResult] = await CartModel.aggregate(
      totalAmountPipeline
    );

    const totalAmount = orderTotalAmountResult.totalAmount;

    const order = await OrderModel.create({
      user: userId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      deliveryDate,
      paymentMethod,
    });

    // Clear cart after placing the order
    const deletedCartItems = await CartModel.deleteMany({ userId });

    res
      .status(201)
      .json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order--->", error);

    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const singleOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { deliveryAddress, deliveryDate, paymentMethod, quantity } = req.body;
    const productId = req.params.productId;

    if (!deliveryAddress || !deliveryDate || !paymentMethod || !quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide required details" });
    }

    // Check if the product exists
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    if (product.stockQuantity < quantity) {
      return res.status(404).json({
        success: false,
        message: `only ${product.stockQuantity} iteam are available in stock`,
      });
    }
    const totalAmount = quantity * product.price;

    const order = await OrderModel.create({
      user: userId,
      items: [
        {
          product: productId,
          quantity: quantity,
        },
      ],
      totalAmount,
      deliveryAddress,
      deliveryDate,
      paymentMethod,
    });

    res
      .status(201)
      .json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order--->", error);

    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const orderHistory = await OrderModel.find({ user: userId });

    res.status(200).json({ success: true, orderHistory });
  } catch (error) {
    console.error("Error fetching order history--->", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getSingleOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error retrieving order details by id --->", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  placeOrder,
  singleOrder,
  getOrderHistory,
  getSingleOrderDetails,
};
