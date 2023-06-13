const express = require("express");
const { accessAuth, authorizeUser } = require("../middlewares/AccessAuth");
const productController = require("../controllers/Products");
const router = express.Router();

// Fetch all products
router.get("/", productController.getAllProducts);

// Add a product (accessible to Dealer and Admin)
router.post(
  "/",
  accessAuth,
  authorizeUser(["Dealer", "Admin"]),
  productController.addProduct
);
// Add multiple products (accessible to Dealer and Admin)
router.post(
  "/bulk",
  accessAuth,
  authorizeUser(["Dealer", "Admin"]),
  productController.addMultipleProducts
);

// Edit a product (accessible to Dealer and Admin)
router.patch(
  "/:productId",
  accessAuth,
  authorizeUser(["Dealer", "Admin"]),
  productController.editProduct
);

// Apply discount to a product (accessible to Dealer and Admin)
router.patch(
  "/:productId/discount",
  accessAuth,
  authorizeUser(["Dealer", "Admin"]),
  productController.applyDiscount
);

module.exports = router;
