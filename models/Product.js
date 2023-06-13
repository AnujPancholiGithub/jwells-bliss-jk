const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  mrp: { type: Number, required: true },
  price: { type: Number, required: true },
  images: [String],
  category: { type: String, required: true },
  brand: String,
  material: String,
  size: String,
  color: String,
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, required: true },
      comment: String,
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
