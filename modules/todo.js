const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  user: String,
  title: String,
  desc: String,
  completed: Boolean,
});

module.exports = mongoose.model("todo", todoSchema);
