import { stringify } from "querystring";

const mongoose = required("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  channel: [],
  created_at: Date,
  updated_at: { type: Date, default: Date.now }
});
