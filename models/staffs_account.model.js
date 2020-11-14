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
    }
});
module.exports = mongoose.model('staffs_account',StaffAccountSchema);