const express = require("express");
const app = express.Router();

const home = require("../Controlers/home");

app.post("/login", home.login);
app.post("/signup", home.signup);
app.post("/createChannel", home.createChannel);
app.post("/myChannels", home.myChannels);
app.post("/search", home.search);
app.post("/getChat", home.getChat);
app.post("/addChat", home.addChat);
app.post("/join", home.join);
app.post("/findUser", home.findUser);
app.post("/invite", home.invite);
app.post("/getrequest", home.getRequest);
app.post("/inviteRes", home.inviteRes);
app.get("*", home.start);

module.exports = app;
