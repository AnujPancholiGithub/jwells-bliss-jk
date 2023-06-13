const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoConnect = require("./helpers/db");
const authRouter = require("./routes/Auth.routes");
const userDetailsRouter = require("./routes/UserDetails.routes");

//Connecting MongoDB
mongoConnect();
const app = express();
// parse REQ data
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Ram ram ji first request on this web app");
});

app.use("/api/auth", authRouter);
app.use("/api/user-details", userDetailsRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server Started on port: ", PORT);
});
