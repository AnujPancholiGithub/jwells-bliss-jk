const bcrypt = require("bcrypt");
const User = require("../models/User.model");
const { generateJwtToken } = require("../helpers/JWT.Verify");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const sgMail = require("@sendgrid/mail");
const {
  emailMessageGenerator,
} = require("../helpers/Email/EmailMessageGenrator");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const { generateOTP } = require("../helpers/OTP.verify");
const { TransactionalEmailsApi } = SibApiV3Sdk;
const { ApiClient } = SibApiV3Sdk;

//mail api setup
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
console.log(process.env.SEND_GRID_API_KEY);

const registerUserSchema = Joi.object({
  name: Joi.string().required(),
  mobile: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().required(),
});

const registerUser = asyncHandler(async (req, res) => {
  try {
    const { error } = registerUserSchema.validate(req.body);

    if (error) {
      console.error(error);
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name, mobile, email, password, role } = req.body;
    const userExist = await User.findOne({ mobile });
    const emailExist = await User.findOne({ email });

    if (userExist || emailExist) {
      return res.status(409).json({
        message: "déjà vu? Looks like you've already an account with us.",
      });
    }

    const otp = generateOTP(6); // Generate a 6-digit OTP

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      mobile,
      email,
      otp,
      password: hashedPassword,
      role,
    });

    //creating message

    // async function sendOTPEmail(email, otp) {
    //   const msg2 = emailMessageGenerator(email, otp, name);
    //   sgMail
    //     .send(msg2)
    //     .then(() => console.log("OTP email sent", otp, "to:", email))
    //     .catch((error) => console.error("Error sending OTP email:", error));
    // }

    // sendOTPEmail(email, otp); // Send OTP to the user's email address

    //-----------> Send in blue [brevo] otp mail sending

    // const sendOtpEmail = async (recipientEmail, otp) => {
    //   const defaultClient = SibApiV3Sdk.ApiClient.instance;
    //   defaultClient.authentications["api-key"].apiKey = sendinblueApiKey;

    //   const apiInstance = new TransactionalEmailsApi();

    //   const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    //   sendSmtpEmail.subject = "Your OTP";
    //   sendSmtpEmail.sender = {
    //     email: "email.email.com",
    //     name: "Jwell Bliss",
    //   };
    //   sendSmtpEmail.replyTo = {
    //     email: "email.email.com",
    //     name: "Jwell Bliss ",
    //   };
    //   sendSmtpEmail.to = [{ name: "Recipient Name", email: recipientEmail }];
    //   sendSmtpEmail.htmlContent = `<html><body><h1>This is your OTP: ${otp}</h1></body></html>`;

    //   try {
    //     const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    //     console.log("OTP email sent successfully to:", recipientEmail, otp);
    //     console.log("response", response);
    //   } catch (error) {
    //     console.log("OTP email not sent ");
    //     console.error("Error sending OTP email:", error);
    //   }
    // };

    // // Usage example:
    // const recipientEmail = "emal....email";
    // await sendOtpEmail(recipientEmail, otp);
    //---------------| end |------------------

    const payload = {
      name: newUser.name,
      email: newUser.email,
      _id: newUser.id,
    };
    const token = generateJwtToken(payload);
    return res.status(201).json({
      message: "User created successfully",
      payload,
      userId: newUser.id,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "something went wrong with account creation",
    });
  }
});

const loginSchema = Joi.object({
  email: Joi.string().email(),
  mobile: Joi.number(),
  password: Joi.string().required(),
});

const logInUser = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { mobile, password, email } = req.body;

    if (!mobile && !email) {
      return res.status(400).json({ message: "mobile or email is required" });
    }

    const user = await User.findOne({ $or: [{ mobile }, { email }] });

    if (!user) {
      return res.status(401).json({
        message: "Invalid mobile or Email",
        email,
        mobile,
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    const isEmailVerified = user.isEmailVerified;

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid mobile or Email or password or not a user",
        email,
        mobile,
        password,
      });
    }
    // if (!isEmailVerified) {
    //   return res.status(401).json({ message: "Email not verified" });
    // }
    const payload = {
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      _id: user.id,
    };

    const token = generateJwtToken(payload);

    res.status(200).json({ message: "Login G", token, User: payload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

//special login for only admin

const adminLogin = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { mobile, password, email } = req.body;

    const user = await User.findOne({ $or: [{ mobile }, { email }] });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid mobile or password or not a Admin" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    const isEmailVerified = user.isEmailVerified;

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid mobile or password or not a user" });
    }
    // if (!isEmailVerified) {
    //   return res.status(401).json({ message: "Email not verified" });
    // }
    if (user.role !== "Admin") {
      return res.status(401).json({ message: "You are not an admin" });
    }
    const payload = {
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      _id: user.id,
    };

    const token = generateJwtToken(payload);

    res.status(200).json({ message: "Login G", token, User: payload });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

//creating a verify user email using otp
const verifyUserEmailUsingOtp = async (req, res) => {
  try {
    const { otp, userId } = req.body;

    if (!otp || !userId) {
      return res.status(400).json({ message: "otp or userId is missing" });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    if (user.otp !== otp) {
      res.status(400).json({ message: "otp is not valid" });
    }

    if (user.otp === otp) {
      user.isEmailVerified = true;

      await user.save();

      const payload = {
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        _id: user.id,
      };

      res.status(200).json({
        message: "email verified successfully",
        payload,
        token: generateJwtToken(payload),
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: " userId is missing" });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    const isEmailVerified = user.isEmailVerified;

    if (isEmailVerified) {
      return res.status(400).json({ message: "email already verified" });
    }

    const otp = generateOTP(6); // Generate a 6-digit OTP
    async function sendOTPEmail(email, otp) {
      const msg2 = emailMessageGenerator(email, otp, user.name);
      sgMail
        .send(msg2)
        .then(() => console.log("OTP email sent", otp, "to:", email))
        .catch((error) => console.error("Error sending OTP email:", error));
    }

    sendOTPEmail(user.email, otp); // Send OTP to the user's email address

    user.otp = otp;
    await user.save();

    res.status(200).json({ message: "otp sent successfully" });
  } catch (error) {}
};

module.exports = {
  registerUser,
  logInUser,
  verifyUserEmailUsingOtp,
  resendOtp,
  adminLogin,
};
