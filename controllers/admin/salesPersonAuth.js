const Salesperson = require("../../models/Salesperson.model");

const registerSalesperson = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await Salesperson.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create a new salesperson
    const salesperson = new Salesperson({
      name,
      email,
      password,
      role: "Salesperson",
      dealer: req.user._id, // Assuming the authenticated user is a dealer assigning the salesperson
    });

    // Save the salesperson to the database
    await salesperson.save();

    res.status(201).json({ message: "Salesperson registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error, message: error.message });
  }
};

const getAllSalespersons = async (req, res) => {
  try {
    const salespersons = await Salesperson.find().populate("dealer", "name");

    res.status(200).json({ salespersons });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { registerSalesperson, getAllSalespersons };
