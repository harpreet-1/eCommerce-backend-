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

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: View cart
 *     description: Retrieve the user's shopping cart.
 *     responses:
 *       200:
 *         description: User's shopping cart
 *       500:
 *         description: Error retrieving the cart
 *
 *   post:
 *     summary: Add to cart
 *     description: Add a product to the user's shopping cart.
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Product added to the cart successfully
 *       400:
 *         description: Adding product to cart failed
 *       500:
 *         description: Error adding product to the cart
 */
cartRouter.route("/").get(viewCart).post(addToCart);

/**
 * @swagger
 * /cart/update/{cartId}:
 *   patch:
 *     summary: Update cart item
 *     description: Update the quantity of a cart item.
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Updating cart item failed
 *       500:
 *         description: Error updating cart item
 */
cartRouter.patch("/update/:cartId", updateCartItem);

/**
 * @swagger
 * /cart/remove/{cartId}:
 *   delete:
 *     summary: Remove cart item
 *     description: Remove a cart item from the user's shopping cart.
 *     parameters:
 *       - name: cartId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item removed successfully
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Error removing cart item
 */
cartRouter.delete("/remove/:cartId", removeCartItem);

module.exports = cartRouter;
