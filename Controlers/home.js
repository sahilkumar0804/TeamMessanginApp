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

module.exports.join = (req, res) => {
  services.findOne(channel, { _id: req.body.cid }, {}, {}, (err, data) => {
    if (err) throw err;
    else {
      data.members.push(req.session.uid);
      data.save();
      res.send(true);
    }
  });
};

module.exports.findUser = (req, res) => {
  var exp = { $and: [] };
  if (req.body.search != "") {
    var regex = new RegExp(req.body.search, "i");
    exp.$and.push({ username: regex });
  }
  services.findPopulate(
    channel,
    {
      _id: { $eq: req.body.channelId }
    },
    (err, data) => {
      if (err) console.log(err);
      if (data) {
        exp.$and.push({ _id: { $nin: data[0].members } });
        exp.$and.push({ _id: { $not: { $eq: data[0].owner } } });
        exp.$and.push({ invite: { $nin: req.body.channelId } });
        services.findPopulate(user, exp, (err, data) => {
          res.send(data);
        });
      }
    }
  );
};

module.exports.invite = (req, res) => {
  services.findOne(
    user,
    {
      _id: { $eq: req.body.userid }
    },
    (err, data) => {
      data.invite.push(req.body.channelId);
      data.save();
      res.send(true);
    }
  );
};

module.exports.getRequest = (req, res) => {
  services.findOne(user, { _id: { $eq: req.session.uid } }, (err, data) => {
    if (data) {
      services.findPopulate(
        channel,
        { _id: { $in: data.invite } },
        (err, data) => {
          res.send(data);
        }
      );
    }
  });
};

module.exports.inviteRes = (req, res) => {
  services.findOne(
    user,
    { _id: { $eq: req.session.uid } },
    {},
    {},
    (err, data) => {
      data.invite.pull(req.body.channelId);
      data.save();
    }
  );
  if (req.body.res) {
    services.findOne(
      channel,
      { _id: { $eq: req.body.channelId } },
      {},
      {},
      (err, data) => {
        data.members.push(req.session.uid);
        data.save();
      }
    );
  }
  res.send("ok");
};

module.exports.topchannel = (req, res) => {
  var match = [
    { $group: { _id: "$channel", sum: { $sum: 1 } } },
    { $sort: { sum: -1 } },
    { $limit: 5 }
  ];
  //console.log(req.body);
  if (req.body.from != "") {
    //var from = new Date(req.body.from).toISOString().substr(0, 10);
    //var to = new Date(req.body.to).toISOString().substr(0, 10);
    match.splice(0, 0, {
      $match: {
        $and: [
          { createdAt: { $gte: new Date(req.body.from) } },
          { createdAt: { $lte: new Date(req.body.to) } }
        ]
      }
    });
  }
  message.aggregate(match, (err, data) => {
    var id = [];
    for (var i = 0; i < data.length; i++) {
      id.push(data[i]._id);
    }
    services.findMany(channel, { _id: { $in: id } }, (err, data) => {
      res.send(data);
    });
  });
};
module.exports.topuser = (req, res) => {
  var match = [
    { $group: { _id: "$name", sum: { $sum: 1 } } },
    { $sort: { sum: -1 } },
    { $limit: 5 }
  ];
  if (req.body.from != "") {
    //var from = new Date(req.body.from).toISOString().substr(0, 10);
    //var to = new Date(req.body.to).toISOString().substr(0, 10);
    match.splice(0, 0, {
      $match: {
        $and: [
          { createdAt: { $gte: new Date(req.body.from) } },
          { createdAt: { $lte: new Date(req.body.to) } }
        ]
      }
    });
  }
  message.aggregate(match, (err, data) => {
    res.send(data);
  });
};
module.exports.topregion = (req, res) => {
  var match = [
    { $group: { _id: "$region", sum: { $sum: 1 } } },
    { $sort: { sum: -1 } },
    { $limit: 5 }
  ];
  if (req.body.from != "") {
    //var from = new Date(req.body.from).toISOString().substr(0, 10);
    //var to = new Date(req.body.to).toISOString().substr(0, 10);
    match.splice(0, 0, {
      $match: {
        $and: [
          { createdAt: { $gte: new Date(req.body.from) } },
          { createdAt: { $lte: new Date(req.body.to) } }
        ]
      }
    });
  }
  user.aggregate(match, (err, data) => {
    res.send(data);
  });
};
module.exports.toptag = (req, res) => {};
