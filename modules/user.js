const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://admin:******@cluster0.ihwrfim.mongodb.net/todoApp" //password from url is removed
);

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "todo",
    },
  ],
});

module.exports = mongoose.model("user", userSchema);
