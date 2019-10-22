const express = require("express");
const app = express.Router();

const authroutes = require("./auth_routes");
const userroutes = require("./userroutes");

app.use("/", authroutes);

module.exports = app;
