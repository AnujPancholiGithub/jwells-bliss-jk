const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin/adminControllers");

router.get("/orders", adminController.getAllOrders);
router.get("/users", adminController.getNewUsers);
router.delete("/orders/:id", adminController.cancelOrder);

module.exports = router;
