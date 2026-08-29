import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: [20, 'Name can have at most 20 characters']
    },
    email: {
        type: String,
        validate: [isEmail, "Please provide a valid email"],
        required: [true, "please provide your email to signup"],
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "please enter your password"],
        min: [8, 'Password should have at least 8 characters'],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, "please confirm your password"],
        validate: {
            validator: function (el) { return el == this.password},
            message: "confirmPassword does not match"
        },
        select: false
    },
    passwordChangedAt: Date,

});


userSchema.pre('save', async function (){
    if(!this.isModified('password')){
        return;
    }

    this.password = await bcrypt.hash(this.password, 10);
    this.passwordConfirm = undefined;
});

userSchema.methods.correctPassword = async function(candidatePassword, password){
    return await bcrypt.compare(candidatePassword, password);
}

const User = mongoose.model('User', userSchema);

export default User;