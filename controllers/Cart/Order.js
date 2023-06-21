const Order = require("../../models/Order.model");

// Get a list of orders for the current user
const getAllOrders = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming you have authentication middleware to get the current user's ID
    const orders = await Order.find({ userId });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific order by its ID
const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { userId, products, address } = req.body;
    const order = new Order({ userId, products, address });
    await order.save();
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update an order by its ID (e.g., update the shipping address)
const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { address } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { address },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel an order by its ID
const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  cancelOrder,
};
