const mongoose = require('mongoose');
const PaymentMethodSchema = mongoose.Schema({
    paymentMethod : {
        type : String,
        required : true
    },
    creditCard : {
        type : String,
        required : true
    },
    status:{
        type: String,
        default: 'ACTIVE'
    }
});
module.exports = mongoose.model('Payment_methods', PaymentMethodSchema);