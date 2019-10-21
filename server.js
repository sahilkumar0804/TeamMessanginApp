const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const server = 8000;
const routes = require("./Routes/all");
const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb://localhost:27017/team", {
  useNewUrlParser: true
});

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/public", express.static(__dirname + "/public"));
app.use(routes);

app.listen(server, (req, res) => {
  console.log(" Server is running. visit localhost:8000");
});
