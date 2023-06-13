const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const { generateJwtToken } = require("../helpers/JWT.Verify");
const asyncHandler = require("express-async-handler");

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, mobile, email, password, role } = req.body;

    if (!name || !email || !password || !mobile || !role) {
      return res.status(401).json({
        message:
          "We kindly request that you provide us with all the required details",
        name,
        mobile,
        email,
        password,
        role,
      });
    }

    const userExist = await User.findOne({ mobile });
    const emailExist = await User.findOne({ email });

    if (userExist || emailExist) {
      return res.status(409).json({
        message: "déjà vu? Looks like you've already an account with us.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      mobile,
      email,
      password: hashedPassword,
      role,
    });

    const payload = {
      name: newUser.name,
      email: newUser.email,
      mobile: newUser.mobile,
      _id: newUser.id,
    };

    return res.status(201).json({
      message: "User created successfully",
      payload,
      token: generateJwtToken(payload),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "something went wrong with account creation",
    });
  }
});

const logInUser = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }

    const token = generateJwtToken({
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      _id: user.id,
    });
    res.status(200).json({ message: "Login SuccesFul", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = { registerUser, logInUser };
