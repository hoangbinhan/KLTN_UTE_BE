const mongoose = require('mongoose');
const constant = require('../common/constants');
const  UserSchema = mongoose.Schema({
    userID : {
        type : String,
        required : true
    },
    name : {
        type : String,
        required : [true, "Please enter your name!!"],
        trim : true
    },
    email : {
        type : String,
        required : [true, "Please enter your email!!"],
        trim : true,
        unique : true
    },
    password : {
        type : String,
        required : [true, "Please enter your password!!"],
    },
    role : {
        type : String,
        default : constant.userRole.member
    }, 
    avatar : {
        type : String
    },
    status : {
        type : String,
        default: 'ACTIVE'
    }
});
module.exports = mongoose.model('users',UserSchema);