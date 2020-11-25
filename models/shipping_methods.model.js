const mongoose = require('mongoose');
const ShippingMethodSchema = mongoose.Schema({
    shippingMethod : {
        type : String,
        required : true
    },
    shippingFee: {
        type: String,
        required: true
    },
    status:{
        type: String,
        default: 'ACTIVE'
    }
});
module.exports = mongoose.model('Shipping_methods', ShippingMethodSchema);