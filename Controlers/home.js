const path = require("../util/path");
const services = require("../Serices/mongo");
const user = require("../Models/user");
const channel = require("../Models/channel");

module.exports.start = (req, res) => {
  res.sendFile(path + "/Public/HTML/index.html");
};

module.exports.login = (req, res) => {
  services.findOne(
    user,
    {
      username: { $eq: req.body.username },
      password: { $eq: req.body.password }
    },
    {},
    {},
    (err, data) => {
      if (err) console.log("error data base erroe");
      else {
        if (data) {
          req.session.uid = data._id;
          req.session.login = true;
          return res.send("success");
        } else {
          res.send("unmatched");
        }
      }
    }
  );
};

module.exports.signup = (req, res) => {
  if (req.body.password == req.body.confirm) {
    services.newdata(
      user,
      {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        region: req.body.region
      },
      (err, data) => {
        res.send("done");
      }
    );
  } else {
    res.send("password not match");
  }
};

module.exports.createChannel = (req, res) => {
  console.log(req.body);
  services.newdata(
    channel,
    {
      name: req.body.name,
      discription: req.body.disc,
      tag: req.body.tag,
      owner: req.session.uid
    },
    (err, data) => {
      if (err) res.send("error");
      else {
        res.send("created");
      }
    }
  );
};

module.exports.myChannels = (req, res) => {
  services.findPopulate(
    channel,
    {
      $or: [
        { owner: { $eq: req.session.uid } },
        { members: { $in: [req.session.uid] } }
      ]
    },
    (err, data) => {
      if (err) console.log(err);
      res.send(data);
    }
  );
};
