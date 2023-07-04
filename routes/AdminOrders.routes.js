const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin/adminControllers");
const { authorizeUser, accessAuth } = require("../middlewares/AccessAuth");

router.get(
  "/orders",
  accessAuth,
  authorizeUser(["Admin"]),
  adminController.getAllOrders
);
router.get("/orders/:id", adminController.getOrderById);
router.get(
  "/users",
  accessAuth,
  authorizeUser(["Admin"]),
  adminController.getNewUsers
);
router.delete(
  "/orders/:id",
  accessAuth,
  authorizeUser(["Admin"]),
  adminController.cancelOrder
);
// API endpoint to calculate the total order value
router.post(
  "/orders/calculate-total",
  accessAuth,
  authorizeUser(["Admin"]),
  adminController.calculateTotalValue
);

module.exports = router;
