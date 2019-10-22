const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema(
  {
    creater: { type: Schema.Types.ObjectId, ref: "users" },
    message: {
      type: String
    },
    channel: [{ type: Schema.Types.ObjectId, ref: "channels" }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("message", messageSchema);
