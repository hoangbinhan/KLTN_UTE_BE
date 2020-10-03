const mongoose = require('mongoose');
const EmployeesSchema = mongoose.Schema({
    employeeID : {
        type : String,
        required : true,
        // default: ''
    },
    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    age : {
        type : String,
        required : true
    },
    dayBirth : {
        type : String,
        
    },
    address : {
        type : String,
        
    },
    gmail : {
        type : String,
       
    },
    status:{
        type: String,
        default: 'ACTIVE'
    }
});
module.exports = mongoose.model('Employees', EmployeesSchema);