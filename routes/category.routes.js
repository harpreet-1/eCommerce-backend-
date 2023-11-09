const express = require("express");

const {
  getCategories,
  addCategory,
} = require("../controllers/categoryController");

const categoryRouter = express.Router();

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get categories
 *     description: Retrieve a list of categories.
 *     responses:
 *       200:
 *         description: A list of categories
 *       500:
 *         description: Error retrieving categories
 *
 *   post:
 *     summary: Add a new category
 *     description: Add a new category to the store.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category added successfully
 *       400:
 *         description: Category addition failed
 *       500:
 *         description: Error adding a category
 */
categoryRouter.route("/").get(getCategories).post(addCategory);

module.exports = categoryRouter;
