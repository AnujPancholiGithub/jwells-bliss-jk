const { verifyJwtToken } = require("../helpers/JWT.Verify");
const User = require("../models/User.model");

const accessAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const payload = await verifyJwtToken(token);
      console.log("verifyJwtToken : ", payload);
      const user = await User.findOne({ email: payload.email });
      if (user) {
        console.log("user in Authorization", user);
        req.user = user;
        next();
      }
    } catch (error) {
      console.log("error: ", error);
      return res
        .status(401)
        .send("Authorization Not Procces Because Of Bad Token");
    }
  } else {
    return res
      .status(401)
      .send("Authorization Not Procces Because Of Bad Token");
  }
};

const authorizeUser = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
};

module.exports = { accessAuth, authorizeUser };
