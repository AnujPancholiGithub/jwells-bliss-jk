const EmailBody = {
  otpBody: (otp) => {
    return `We are sending you 2 this email to verify your account on our website

Your one-time password (OTP) is: ${otp}

Please enter this OTP in the OTP field on the OTP Page login page to complete your registration.

This OTP is valid for 5 minutes.

If you did not create an account on OUR , please disregard this email.

Thank you,
Incredible devs Team`;
  },
};

module.exports = { EmailBody };
