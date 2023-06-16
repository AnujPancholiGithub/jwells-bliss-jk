const { generateOTP } = require("../OTP.verify");
const { EmailBody } = require("./EmailMessages");

const emailMessageGenerator = (to) => {
  otp = generateOTP(6);
  const msg = {
    to, // Change to your recipient
    from: "anujdevs@aol.com",
    subject: "Your One-Time Password (OTP) for verification",
    text: EmailBody.otpBody(otp),
  };
  return msg;
};

module.exports = { emailMessageGenerator };
