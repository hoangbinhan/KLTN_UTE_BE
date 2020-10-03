const mongoose = require('mongoose');
const ShippingMethodSchema = mongoose.Schema({
    shippingMethodID : {
        type : String,
        required : true,
        // default: ''
    },
    shippingMethod : {
        type : String,
        required : true
    },
    status:{
        type: String,
        default: 'ACTIVE'
    }
});
module.exports = mongoose.model('Shipping_methods', ShippingMethodSchema);