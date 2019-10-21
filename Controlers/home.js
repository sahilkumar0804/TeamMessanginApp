const path = require("../util/path");

module.exports.start = (req, res) => {
  res.sendFile(path + "/Public/HTML/index.html");
};

module.exports.login = (req, res) => {
  console.log(req.body);
};

module.exports.signup = (req, res) => {
  console.log(req.body);
};
