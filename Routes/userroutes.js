const express = require("express");
const app = express.Router();

app.get("*", (req, res) => {
  res.send("hlo");
});
module.exports = app;
