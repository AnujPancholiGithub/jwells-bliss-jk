const Cart = require("../../models/Cart.model");
const Order = require("../../models/Order.model");

const getCart = async (req, res) => {
  console.log("i am in getCart", req.user);
  try {
    // Retrieve the current user's shopping cart from the database
    console.log("i am in getCart", req.user);
    const user = req.user; // Assuming the user is authenticated and available in the request object
    const cart = await Cart.findOne({ user: user._id }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addItemToCart = async (req, res) => {
  console.log("i am in addCart", req.user);
  try {
    // Extract the product ID and quantity from the request body
    const { productId, quantity } = req.body;
    if (
      !productId ||
      !quantity ||
      Number(quantity) < 1 ||
      req.user === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Product ID and quantity are required" });
    }

    // Retrieve the current user's shopping cart from the database
    const user = req.user; // Assuming the user is authenticated and available in the request object
    let cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      // If the cart doesn't exist, create a new one for the user
      cart = new Cart({ user: user._id, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      // If the product already exists, update the quantity
      existingItem.quantity += parseInt(quantity);
    } else {
      // If the product doesn't exist, add it to the cart
      cart.items.push({ product: productId, quantity: parseInt(quantity) });
    }

    // Save the updated cart to the database
    await cart.save();

    res.status(201).json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateCartItemQuantity = async (req, res) => {
  try {
    // Extract the item ID and quantity from the request parameters and body
    const { id } = req.params;
    const { quantity } = req.body;

    // Retrieve the current user's shopping cart from the database
    const user = req.user; // Assuming the user is authenticated and available in the request object
    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the item in the cart
    const item = cart.items.find((item) => item._id.toString() === id);

    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Update the quantity of the item
    item.quantity = parseInt(quantity);

    // Save the updated cart to the database
    await cart.save();

    res
      .status(200)
      .json({ message: "Item quantity updated successfully", cart });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeCartItem = async (req, res) => {
  try {
    // Extract the item ID from the request parameters
    const { id } = req.params;

    // Retrieve the current user's shopping cart from the database
    const user = req.user; // Assuming the user is authenticated and available in the request object
    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Find the index of the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item._id.toString() === id
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Save the updated cart to the database
    await cart.save();

    res
      .status(200)
      .json({ message: "Item removed from cart successfully", cart });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const processCheckout = async (req, res) => {
  try {
    // Retrieve the current user's shopping cart from the database
    const user = req.user; // Assuming the user is authenticated and available in the request object
    const cart = await Cart.findOne({ user: user._id }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    //  payment processing logic here
    // ...

    // Create an order based on the cart contents
    const order = new Order({
      user: user._id,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
    });

    // Save the order to the database
    await order.save();

    // Clear the user's shopping cart
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeCartItem,
  processCheckout,
};
