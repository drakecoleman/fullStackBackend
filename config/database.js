const mongoose = require("mongoose");

// require("dotenv").config();
require("dotenv").config({ path: `.env` });

// const conn = process.env.DB_STRING;

const connection = mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const UserSchema = new mongoose.Schema({
  username: String,
  fName: String,
  lName: String,
  title: String,
  hash: String,
  salt: String,
  admin: Boolean,
  chats: [{ userid: String, messages: [{ user: String, message: String }] }],
});

const User = mongoose.model("User", UserSchema);

module.exports = connection;
