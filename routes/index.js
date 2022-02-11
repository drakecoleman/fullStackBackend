const router = require("express").Router();
const passport = require("passport");
const bodyParser = require("body-parser");
const genPassword = require("../lib/passwordUtils").genPassword;
const connection = require("../config/database");
const mongoose = require("mongoose");
const User = mongoose.models.User;
const isAuth = require("./authMiddleware").isAuth;
// cors is needed with router.use else you have to put routes on the app.js
const cors = require("cors");
router.use(
  cors({
    origin: [
      "http://2607:fb90:b6e0:a363:f89f:be4b:a976:9ed0:3001",
      "https://fullfrontend.herokuapp.com/",

      "http://localhost:3001",
      "localhost:3001",
      "http://localhost:3000",
      "localhost:3000",
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
// const isAdmin = require("./authMiddleware").isAdmin;
router.use(bodyParser.urlencoded({ extended: false }));

/**
 * -------------- Post ROUTES ----------------
 *
 */

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      throw err;
    } else if (!user) {
      res.send("No User Exists");
    } else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send(user);
        return;
      });
    }
  })(req, res, next);
});

router.post("/register", (req, res) => {
  const saltHash = genPassword(req.body.repeatPassword);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username: req.body.firstInput,
    fName: "",
    lName: "",
    title: "",
    hash: hash,
    salt: salt,
  });

  newUser.save().then((user) => {});
  res.sendStatus(200);
});
router.post("/getUserProfile", (req, res) => {
  User.find({ _id: req.body.f }, function (err, user) {
    res.status(200).send(user);
  });
});

/**
 * -------------- GET ROUTES ----------------
 *
 */

router.post("/user", (req, res) => {
  const fName = req.body.firstInput;
  const lName = req.body.secondInput;

  const title = req.body.repeatPassword;

  const user = req.session.passport.user;
  User.updateOne(
    { _id: user },
    { fName: fName, lName: lName, title: title },
    function (err, result) {
      if (err) {
        res.sendStatus(401);
        console.log(err);
      } else {
        res.sendStatus(200);
      }
    }
  );
});
router.get("/getChats", (req, res) => {
  const theUser = req.user._id;
  const theUsersChatIds = [];
  const theUserChats = [];

  User.findOne({ _id: theUser }, function (err, user) {
    if (!err) {
      user.chats.forEach((item) => {
        theUsersChatIds.push(item.userid);
      });
    } else {
      console.log(err);
    }
  })
    .then((response) => {
      console.log(theUsersChatIds);
      User.find(
        {
          _id: {
            $in: theUsersChatIds,
          },
        },
        function (err, docs) {
          if (!err) {
            docs.forEach((item) => {
              theUserChats.push({
                _id: item._id,
                firstName: item.fName,
                lastName: item.lName,
              });
            });
            res.status(200).json(theUserChats);
          } else {
            console.log(err);
          }
        }
      ).then(() => {});
    })
    .catch((err) => console.log(err));
});
// router.get("/messages", isAuth, (req, res) => {
//   res.status(200).json({ user: req.user, auth: true, response });
// });
router.get("/", isAuth, (req, res) => {
  const userMap = {};
  User.find({}, function (err, users) {
    users.forEach(function (user) {
      userMap[user._id] = user;
    });
    return userMap;
  })
    .then((response) => {
      res.status(200).json({ user: req.user, auth: true, response });
    })
    .catch((err) => console.log(err, "Here"));
});

module.exports = router;
