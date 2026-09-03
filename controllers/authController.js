import User from "../models/userModel.js";
import catchAsync from "../Utils/catchAsync.js";
import jwt from "jsonwebtoken";
import AppError from "../Utils/AppError.js";
import { promisify } from "util";
import sendEmail from "../Utils/email.js";
import crypto from 'crypto';

const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const sendToken = (newUser, statusCode, res) => {
  const token = signToken(newUser.id);
  console.log(token);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: true,
  };

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    data: {
      token,
      newUser,
    },
  });
};

const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  sendToken(newUser, 201, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Cannot login without email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid password, or user does not exist"));
  }

  sendToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Email or passowrd not present!", 400));
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new AppError("No user found with this id", 400));
  }

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Invalid Password!"));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.save();

  sendToken(user, 200, res);
});

// protect the routes// authorize users
const protect = catchAsync(async (req, res, next) => {
  let token;
  let auth = req.headers.authorization;

  if (auth && auth.startsWith("Bearer")) {
    token = auth.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Token not found!"));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError("User belonging to this token no longer exists", 401),
    );
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User changed password after token was issued"));
  }
  req.user = user;
  next();
});

// let's add forgot and reset functionality
const forgotPassword = catchAsync(async function (req, res, next) {
  let { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(
      new AppError("No user found, Please check the credentials!", 404),
    );
  }

  let resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/users/resetpassword/${resetToken}`;
  const message = `Forgot your Password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didin't forget your password, please ignore this email`;

  try {
    console.log("email:::", user.email);
    await sendEmail({
      to: user.email,
      subject: "Your password reset token is valid for 10minutes",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email! please try again later",
        500,
      ),
    );
  }
});

const resetPassword = catchAsync(async function(req, res, next) {
    const resetToken = crypto.createHash('SHA256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: resetToken,
        passwordResetExpires: {$gt: Date.now()}

    });

    if(!user){
        return next(new AppError("Token is invalid or expired", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    sendToken(user, 201, res);
});

const restrictTo = function(...roles) {
    return function(req, res, next){  
    if(!roles.includes(req.user.role)){
      return next(new AppError("user is not authorized to access the resource!", 403));
        }
        
        next();
    }

}

export { signUp, login, updatePassword, protect, forgotPassword, resetPassword, restrictTo };
