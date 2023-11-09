// cartController.js

const CartModel = require("../Models/Cart");
const ProductModel = require("../Models/Product");

// Add a product to the user's cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quantity } = req.body;
    const { productId } = req.params;
    if (!quantity) {
      return res.status(400).json({
        success: false,
        message: "please provide quantity of product.",
      });
    }
    // Checking if the product is already in the cart for the user

    const existingCartItem = await CartModel.findOne({
      userId,
      productId,
    });

    if (existingCartItem) {
      return res.status(400).json({
        success: false,
        message: "Product is already in the cart.",
        existingCartItem,
      });
    }

    // if product is available in store  then adding in cart and upadating stockquantity

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res
        .status(400)
        .json({ success: false, error: "porudct not available" });
    }

    if (product.stockQuantity < quantity) {
      return res.status(400).json({
        success: false,
        maxQuantity: product.stockQuantity,
        message: `Only ${product.stockQuantity} Iteam are available in stock. `,
      });
    }

    const newCartItem = await CartModel.create({
      userId,
      productId,
      quantity,
    });

    product.stockQuantity -= quantity;
    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product added to cart.",
      newCartItem,
    });
  } catch (error) {
    console.log("error from add to cart ---->", error);

    res.status(500).json({ success: false, error: "internal server error." });
  }
};

const viewCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await CartModel.find({ userId });

    res.status(200).json(cartItems);
  } catch (error) {
    console.log("error from viewCart ---->", error);
    res.status(500).json({ error: "Error retrieving the cart" });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { quantity } = req.body;

    const userId = req.user.id;

    // validation ---
    if (!quantity || !cartId) {
      return res
        .status(400)
        .json({ success: false, message: "please provide all details" });
    }

    // checking is cart belong to same user or not

    const cartItem = await CartModel.findById(cartId);

    if (!cartItem || cartItem.userId != userId) {
      return res
        .status(400)
        .json({ success: false, message: "Cart Item not  found" });
    }
    const oldQuantity = cartItem.quantity;
    const product = await ProductModel.findById(cartItem.productId);

    //  product in store  check ********
    if (!product || (!product.stockQuantity && quantity > oldQuantity)) {
      console.log(product);
      return res.status(200).json({
        success: false,
        message: `Product is out of stock`,
      });
    }
    // same quantity check********
    if (quantity === oldQuantity) {
      return res
        .status(400)
        .json({ success: false, message: "No update found!" });
    }

    // req for decrease quantity********

    if (quantity < oldQuantity) {
      product.stockQuantity += oldQuantity - quantity;
      await product.save();
    } else {
      let updatedQuantity = quantity - oldQuantity;

      if (product.stockQuantity < updatedQuantity) {
        return res.status(200).json({
          success: false,
          message: `Only ${product.stockQuantity} more iteams available in stock. `,
          maxQuantity: oldQuantity + product.stockQuantity,
        });
      }
      product.stockQuantity -= updatedQuantity;
      await product.save();
    }
    const updatedProduct = await CartModel.findByIdAndUpdate(cartId, {
      quantity,
    });

    return res.json({
      success: true,
      message: "Product Quantity updated in cart.",
      newQuantity: quantity,
    });
  } catch (error) {
    console.log("error from update cart---->", error);

    res.status(500).json({ success: false, error: "internal server error." });
  }
};
// Route to remove a product to the cart
const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartId } = req.params;

    const cartItem = await CartModel.findById(cartId);

    if (!cartItem || cartItem.userId != userId) {
      return res
        .status(400)
        .json({ success: false, message: "Cart Item not  found" });
    }

    const product = await ProductModel.findById(cartItem.productId);

    const deleted = await CartModel.findByIdAndDelete(cartId);

    product.stockQuantity += cartItem.quantity;
    product.save();

    return res.status(200).json({
      success: true,
      message: "Product  removed from cart.",
    });
  } catch (error) {
    console.log("error from removeCartItem---->", error);
    res.status(500).json({ success: false, error: "internal server error." });
  }
};

module.exports = {
  addToCart,
  viewCart,
  updateCartItem,
  removeCartItem,
};
