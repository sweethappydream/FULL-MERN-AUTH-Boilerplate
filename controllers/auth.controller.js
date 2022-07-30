const User = require("../models/auth.model");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");

const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { errorHandler } = require("../helpers/dbErrorHandling");

exports.registerController = (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  console.log(req.body, errors.isEmpty());
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    User.findOne({
      email,
    }).exec((err, user) => {
      if (user) {
        return res.status(400).json({
          errors: "Email is taken",
        });
      }
    });

    const user = new User({
      name,
      email,
      password,
      role: "62e3a7fb10760000fd00727c",
    });

    user.save((err, user) => {
      if (err) {
        console.log("Save error", errorHandler(err));
        return res.status(401).json({
          errors: errorHandler(err),
        });
      } else {
        return res.json({
          success: true,
          message: user,
          message: "Signup success",
        });
      }
    });
  }
};

// exports.activationController = (req, res) => {
//   const { token } = req.body;

//   if (token) {
//     jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, (err, decoded) => {
//       if (err) {
//         console.log('Activation error');
//         return res.status(401).json({
//           errors: 'Expired link. Signup again'
//         });
//       } else {
//         const { name, email, password } = jwt.decode(token);

//         console.log(email);
//         const user = new User({
//           name,
//           email,
//           password
//         });

//         user.save((err, user) => {
//           if (err) {
//             console.log('Save error', errorHandler(err));
//             return res.status(401).json({
//               errors: errorHandler(err)
//             });
//           } else {
//             return res.json({
//               success: true,
//               message: user,
//               message: 'Signup success'
//             });
//           }
//         });
//       }
//     });
//   } else {
//     return res.json({
//       message: 'error happening please try again'
//     });
//   }
// };

exports.signinController = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // check if user exist
    User.findOne({ email })
      .populate("role")
      .exec((err, user) => {
        if (err || !user) {
          console.log(err);
          return res.status(400).json({
            errors: "User with that email does not exist. Please signup",
          });
        }
        // authenticate
        if (!user.authenticate(password)) {
          return res.status(400).json({
            errors: "Email and password do not match",
          });
        }
        // generate a token and send to client
        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );
        const { _id, name, email, role } = user;

        return res.json({
          token,
          user: {
            _id,
            name,
            email,
            role,
          },
        });
      });
  }
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET, // req.user._id
});

exports.adminMiddleware = (req, res, next) => {
  console.log(req.user);
  User.findById({ _id: req.user._id, })
    .populate("role")
    .exec((err, user) => {
    if (err || !user) {
      console.log(err, user);
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role.role !== "admin") {
      return res.status(400).json({
        error: "Admin resource. Access denied.",
      });
    }

    req.profile = user;
    next();
  });
};
