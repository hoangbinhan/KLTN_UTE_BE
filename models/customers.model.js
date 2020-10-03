const mongoose = require('mongoose');
const CustomerSchema = mongoose.Schema({
    customerID : {
        type : String,
        required : true,
        // default: ''
    },
    companyName : {
        type : String,
        required : true
    },
    contactFirstname : {
        type : String,
        required : true
    },
    contactLastname : {
        type : String,
        required : true
    },
    billingAddress : {
        type : String,
    },
    city : {
        type : String,
    },
    stateOrProvince : {
        type : String,
    },
    postalCode : {
        type : String,
    },
    country : {
        type : String,
    },
    contactTitle : {
        type : String,
    },
    phoneNumber : {
        type : String,
    },
    faxNumber : {
        type : String,
    },
    status:{
        type: String,
        default: 'ACTIVE'
    }
});
module.exports = mongoose.model('Customers', CustomerSchema);