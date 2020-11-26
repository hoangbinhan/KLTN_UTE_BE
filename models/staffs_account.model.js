const mongoose = require('mongoose');
const constant = require('../common/constants');
const  StaffAccountSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        trim : true
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        default : constant.userRole.staff
    }, 
    status : {
        type : String,
        default: 'ACTIVE'
    },
    firstName: {
        type: String, 
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
});
module.exports = mongoose.model('staffs_account',StaffAccountSchema);