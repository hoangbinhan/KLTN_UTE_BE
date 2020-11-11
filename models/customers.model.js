const mongoose = require('mongoose');
const CustomerSchema = mongoose.Schema({
    phoneNumber: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required:true
    },
    lastName: {
        type: String,
        required:true
    },
    email:{
        type: String
    },
    address:{
        type: String,
        required: true
    },
    invoices:{
        type: [mongoose.Schema.Types.ObjectId]
    }
});
module.exports = mongoose.model('Customers', CustomerSchema);