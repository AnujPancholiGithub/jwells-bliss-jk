const { default: mongoose } = require("mongoose");

const SalespersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Salesperson"],
    required: true,
  },
  commission: {
    type: Number,
    default: 0,
  },
  dealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  productsSold: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
      },
      revenue: {
        type: Number,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Salesperson = mongoose.model("Salesperson", SalespersonSchema);

module.exports = Salesperson;
