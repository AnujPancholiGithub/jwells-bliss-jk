const Order = require("../../models/Order.model");
const User = require("../../models/User.model");

// Get all orders from all users
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get new users
const getNewUsers = async (req, res) => {
  try {
    const newUsers = await User.find({
      role: "Customer",
    })
      .select("name email mobile createdAt")
      .sort({
        createdAt: -1,
      });
    res.json(newUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel an order
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
  getNewUsers,
  cancelOrder,
};
