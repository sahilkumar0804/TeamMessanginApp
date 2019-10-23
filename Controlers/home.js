const path = require("../util/path");
const services = require("../Serices/mongo");
const user = require("../Models/user");
const channel = require("../Models/channel");
const message = require("../Models/messages");

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
          req.session.name = data.username;
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
      if (data.length) res.send(data);
      else res.send("empty");
    }
  );
};

module.exports.search = (req, res) => {
  var exp = {
    $and: [
      { owner: { $not: { $eq: req.session.uid } } },
      { members: { $nin: [req.session.uid] } }
    ]
  };
  if (req.body.search != "") {
    var regex = new RegExp(req.body.search, "i");
    exp.$and.push({ name: regex });
  }
  services.findMany(channel, exp, (err, data) => {
    if (err) console.log(err);
    if (data.length) res.send(data);
    else res.send("empty");
  });
};

module.exports.getChat = (req, res) => {
  services.getChat(
    message,
    {
      channel: { $eq: req.body.channelId }
    },
    {
      limit: 10,
      skip: (Number(req.body.page) - 1) * 10
    },
    { createdAt: -1 },
    (err, data) => {
      if (err) console.log(err);
      if (data.length) res.send(data);
      else res.send("empty");
    }
  );
};

module.exports.addChat = (req, res) => {
  services.newdata(
    message,
    {
      name: req.session.name,
      message: req.body.message,
      channel: req.body.channelId
    },
    (err, data) => {
      if (data) {
        res.send(data);
      }
    }
  );
};
