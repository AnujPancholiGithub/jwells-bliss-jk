const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin/adminControllers");

router.get("/orders", adminController.getAllOrders);
router.get("/users", adminController.getNewUsers);
router.delete("/orders/:id", adminController.cancelOrder);
// API endpoint to calculate the total order value
router.post("/orders/calculate-total", adminController.calculateTotalValue);

module.exports = router;
