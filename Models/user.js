const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    region: {
      type: String,
      required: true
    },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
    },
    invite: []
    //   created_at: Date,
    //   updated_at: { type: Date, default: Date.now }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("user", userSchema);
