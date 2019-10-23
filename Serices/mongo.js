module.exports.newdata = (model, query = {}, callback) => {
  console.log("called");
  new model(query).save(callback);
};

module.exports.findOne = (
  model,
  query = {},
  projection = {},
  options = {},
  callback
) => {
  model.findOne(query, projection, options, callback);
};

module.exports.findPopulate = (model, query = {}, callback) => {
  model
    .find(query)
    .populate({
      path: "members"
    })
    .exec(callback);
};

module.exports.findMany = (model, query = {}, callback) => {
  model.find(query, callback);
};

module.exports.getChat = (
  model,
  query = {},
  options = {},
  sort = {},
  callback
) => {
  model
    .find(query, {}, options)
    .sort(sort)
    .exec(callback);
};
