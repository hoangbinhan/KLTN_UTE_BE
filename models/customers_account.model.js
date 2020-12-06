const mongoose = require('mongoose');
const  CustomersAccountSchema = mongoose.Schema({
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        default : 'customer'
    }, 
    status : {
        type : String,
        default: 'ACTIVE'
    },
    name: {
        type: String, 
        required: true
    },
    phoneNumber: {
        type: String,
    },
    address: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    cart: {
        type: [Object],
    },
    invoices: {
        type: [Object]
    }
});
module.exports = mongoose.model('customers_account',CustomersAccountSchema);