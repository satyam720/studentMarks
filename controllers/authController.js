import User from "../models/userModel.js";
import catchAsync from "../Utils/catchAsync.js";
import jwt from 'jsonwebtoken';
import AppError from "../Utils/AppError.js";

const signToken = function(id){
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

}

const sendToken = (newUser, statusCode, res) => {
    const token = signToken(newUser.id);
    console.log(token);
    res.status(statusCode).json({
        status: 'success',
        data: {
            token,
            newUser
        }
    });
}

const signUp = catchAsync(async (req,res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,

    });

    sendToken(newUser, 201, res);


});

const login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new AppError('Cannot login without email or password', 400));
    }

    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError("Invalid password, or user does not exist"));
    }
    
    sendToken(user, 200, res);
})

export {signUp, login};