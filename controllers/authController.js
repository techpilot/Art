const crypto = require("crypto")
const { promisify } = require("util")
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const catchAsync = require("../utils/catchAsync")
const AppError = require("../utils/appError")
const {success} = require("parcel-bundler/lib/utils/emoji");

const signToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookiesOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  }

  res.cookie('jwt', token, cookiesOption)

  // Remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
}

// SIGNUP
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  })

  const url = `${req.protocol}://${req.get('host')}/me`
  console.log(url)

  createSendToken(newUser, 201, res);
})

// LOGIN
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // Check if email and password exist
  if (!email || !password) return next(new AppError("Please provide an email and password", 401));

  // check if the user exists and the password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 201, res);
})

// LOGOUT
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 + 1000),
    httpOnly: true
  })
  res.status(200).json({ status: "success" });
}

// PROTECTED ROUTE: Permission to the logged in users only
exports.protect = catchAsync(async (req, res, next) => {
  //  getting token and check if it exists
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token)

  if (!token) return next(new AppError("Please log in to access", 401));

  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // check if the user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("User does no longer exist", 401));
  }

  //  GRANT ACCESS TO USER
  req.user = currentUser
  // req.locals.user = currentUser
  next()
})

// Only for rendered pages and no error
exports.isLoggedIn = async (req, res, next) => {
  // Getting token and check if it exists
  if (req.cookies.jwt) {
    try {
      // Verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // Check if user still exits
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

// RESTRICT SUCH AS ADMIN PRIVILEGES
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // provide user roles such as restricted admin roles
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }
    next()
  }
}