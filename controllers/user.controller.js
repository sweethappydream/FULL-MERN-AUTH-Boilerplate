const User = require("../models/auth.model");
const expressJwt = require("express-jwt");
const Role = require("../models/Role");

exports.readController = (req, res) => {
  const userId = req.params.id;
  User.findById(userId)
    .populate("role")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
};

exports.readAllController = (req, res) => {
  const userId = req.params.id;
  User.find()
    .populate("role")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      console.log(user);
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
};

exports.updateController = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const { name, password } = req.body;

  User.findOne({ _id: req.user._id })
    .populate("role")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      if (!name) {
        return res.status(400).json({
          error: "Name is required",
        });
      } else {
        user.name = name;
      }

      if (password) {
        if (password.length < 6) {
          return res.status(400).json({
            error: "Password should be min 6 characters long",
          });
        } else {
          user.password = password;
        }
      }

      user.save((err, updatedUser) => {
        if (err) {
          console.log("USER UPDATE ERROR", err);
          return res.status(400).json({
            error: "User update failed",
          });
        }
        updatedUser.hashed_password = undefined;
        updatedUser.salt = undefined;
        res.json(user);
      });
    });
};

exports.updateRoleController = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const { role, _id } = req.body;

  Role.findOne({ role: role }).exec((err, data) => {
    if (err || !data) {
      return res.status(400).json({
        error: "Role not found",
      });
    }
    User.findOne({ _id: _id }).populate("role").exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      user.role = data._id;
      user.save((err, updatedUser) => {
        if (err) {
          console.log("USER UPDATE ERROR", err);
          return res.status(400).json({
            error: "User update failed",
          });
        }
        user.role = data;
        res.json(user)
      });
    });
  });
};
