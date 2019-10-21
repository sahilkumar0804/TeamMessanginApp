const express = require("express");
const app = express.Router();

const home = require("../Controlers/home");

app.post("/login", home.login);
app.post("/signup", home.signup);
app.get("*", home.start);

module.exports = app;
