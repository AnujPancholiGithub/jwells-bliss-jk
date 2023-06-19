// if (process.env.NODE_ENV === "dev") {
// const dotenv = require("dotenv");
// dotenv.config();
// }
console.log(process.env.NODE_ENV);
const cors = require("cors");
const express = require("express");
const mongoConnect = require("./helpers/db");
const authRouter = require("./routes/Auth.routes");
const userDetailsRouter = require("./routes/UserDetails.routes");
const errorHandler = require("./middlewares/errorHandler");
const productRouter = require("./routes/Products.routes");
const errorReqRouter = require("./middlewares/errorRouteHandler");

//Connecting MongoDB
mongoConnect();
const app = express();
// parse REQ data
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//cors
app.use(cors());

let count = 0;
app.get("/", (req, res) => {
  res.send(`Welcome To Jwell Bliss ${count++}`);
});

app.use(
  "/api/auth",
  (res, req, next) => {
    count++;
    next();
  },
  authRouter
);
app.use(
  "/api/user-details",
  (res, req, next) => {
    count++;
    next();
  },
  userDetailsRouter
);
app.use(
  "/api/products",
  (res, req, next) => {
    count++;
    next();
  },
  productRouter
);
//error handler -----
app.use(
  "/",
  (res, req, next) => {
    count++;
    next();
  },
  errorReqRouter
);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server Started on port: ", PORT);
});
