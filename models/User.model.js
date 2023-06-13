const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Dealer", "Customer"], required: true },
  userDetails: { type: mongoose.Schema.Types.ObjectId, ref: "UserDetails" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
