const mongoose = require("mongoose");

// require("dotenv").config();
require("dotenv").config({ path: `.env` });

// const conn = process.env.DB_STRING;

const connection = mongoose.connect(
  `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.tp1sb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

//process.env.DB_STRING

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
