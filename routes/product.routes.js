const express = require("express");
const {
  addProduct,
  getProducts,
  getProductDetails,
} = require("../controllers/productController");

const productRouter = express.Router();

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Get products
 *     description: Retrieve a list of products.
 *     responses:
 *       200:
 *         description: A list of products
 *       500:
 *         description: Error retrieving products
 *
 *   post:
 *     summary: Add a new product
 *     description: Add a new product to the store.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               category:
 *                 type: string
 *               stockQuantity:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Product addition failed
 *       500:
 *         description: Error adding a product
 */
productRouter.route("/").get(getProducts).post(addProduct);

/**
 * @swagger
 * /product/{id}:
 *   get:
 *     summary: Get product details
 *     description: Retrieve details of a product by its ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error retrieving product details
 */
productRouter.get("/:id", getProductDetails);

module.exports = productRouter;
