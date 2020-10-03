const mongoose = require('mongoose');
const PaymentSchema = mongoose.Schema({
    paymentID : {
        type : String,
        required : true,
        // default: ''
    },
    orderID : {
        type : String,
        required : true,
        // default: ''
    },
    paymentAmount : {
        type : String,
        required : true
    },
    paymentDate : {
        type : String,
        required : true
    },
    creditCardNumber : {
        type : String,
        required : true
    },
    cardHoldersName : {
        type : String,
        
    },
    creditCardExpDate : {
        type : String,
        
    },
    paymentMethodID : {
        type : String,
        required : true,
        // default: ''
    },
    status:{
        type: String,
        default: 'ACTIVE'
    }
});
module.exports = mongoose.model('Payments', PaymentSchema);