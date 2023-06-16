const express = require("express");

const router = express.Router();

router
  .route("/*")
  .get((req, res) => {
    let param = 
    return res.send("We Don't Have Anything on this URL" + req.params.filepath);
  })
  .post((req, res) => {
    return res.send("Post Url Not Found");
  });

module.exports = router;
