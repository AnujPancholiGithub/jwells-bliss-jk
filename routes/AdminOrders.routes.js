const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin/adminControllers");
const { authorizeUser, accessAuth } = require("../middlewares/AccessAuth");
const {
  getAllSalespersons,
  registerSalesperson,
  getSalespersonById,
  updateSalesperson,
} = require("../controllers/admin/salesPersonAuth");

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

router.get("/salesperson/:id", getSalespersonById);
router.get("/all-salespersons", getAllSalespersons);
router.post(
  "/register-salesperson",
  accessAuth,
  authorizeUser(["Admin", "Dealer"]),
  registerSalesperson
);

//updateSalesperson
router.put("/salesperson/:id", updateSalesperson);

module.exports = router;
