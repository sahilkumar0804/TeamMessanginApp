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
