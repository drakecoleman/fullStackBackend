const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const connection = require("./database");
const mongoose = require("mongoose");
const User = mongoose.models.User;
const validPassword = require("../lib/passwordUtils").validPassword;
const cors = require("cors");
passport.use(
  cors({
    origin: [
      "http://2607:fb90:b6e0:a363:f89f:be4b:a976:9ed0:3001",
      "https://fullfrontend.herokuapp.com/",
      "http://localhost:3001",
      "localhost:3001",
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

const customFields = {
  usernameField: "username",
  passwordField: "password",
};

passport.use(
  new LocalStrategy(customFields, (username, password, done) => {
    User.findOne({ username: username })
      .then((user) => {
        if (!user) {
          console.log("No user");
          return done(null, false);
        } else {
          const isValid = validPassword(password, user.hash, user.salt);
          if (isValid) {
            console.log("Logged in");

            return done(null, user);
          } else {
            console.log("Wrong Password");
            return done(null, true);
          }
        }
      })
      .catch((err) => {
        done(err);
      });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  }).catch((err) => done(err));
});
