module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
    // res.status(200).json({ user: req.user, auth: true });
  } else {
    return res.status(401).json({ auth: false, msg: "Here" });
  }
};

// module.exports.isAdmin = (req, res, next) => {
//     if (req.isAuthenticated() && req.user.admin) {
//         next();
//     } else {
//         res.status(401).json({ msg: 'You are not authorized to view this resource because you are not an admin.' });
//     }
// }
