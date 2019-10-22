const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const channelSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    discription: String,
    owner: { type: Schema.Types.ObjectId, ref: "user" },
    members: [{ type: Schema.Types.ObjectId, ref: "user" }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("channel", channelSchema);
