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
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  alternativeNo: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  aadharCardNo: {
    type: String,
    required: true,
  },
  aadharCardImage: {
    type: String,
  },
  panCardNo: {
    type: String,
  },
  panCardImage: {
    type: String,
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
