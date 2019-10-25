const express = require("express");
const app = express.Router();

const home = require("../Controlers/home");

const auth = (req, res, next) => {
  if (req.session.login) res.status = 401;

  next();
};

app.post("/login", auth, home.login);
app.post("/signup", auth, home.signup);
app.post("/createChannel", auth, home.createChannel);
app.post("/myChannels", auth, home.myChannels);
app.post("/search", auth, home.search);
app.post("/getChat", auth, home.getChat);
app.post("/addChat", auth, home.addChat);
app.post("/join", auth, home.join);
app.post("/findUser", auth, home.findUser);
app.post("/invite", auth, home.invite);
app.post("/getrequest", auth, home.getRequest);
app.post("/inviteRes", auth, home.inviteRes);
app.post("/topchannels", auth, home.topchannel);
app.post("/topuser", auth, home.topuser);
app.post("/topregion", auth, home.topregion);
app.post("/toptag", auth, home.toptag);
app.get("*", home.start);

module.exports = app;
