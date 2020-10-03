const mongoose = require('mongoose');
const OrderSchema = mongoose.Schema({
    orderID : {
        type : String,
        required : true,
        // default: ''
    },
    customerID : {
        type : String,
        required : true,
        // default: ''
    },
    employeeID : {
        type : String,
        required : true,
        // default: ''
    },
    orderDate : {
        type : Date,
        required : true
    },
    purchaseOrderNumber : {
        type : String,
        required : true
    },
    shipName : {
        type : String,
        required : true
    },
    shipAddress : {
        type : String,
    },
    shipCity : {
        type : String,
    },
    shipStateOrProvince : {
        type : String,
    },
    shipPostalCode : {
        type : String,
    },
    shipCountry : {
        type : String,
    },
    shipPhoneNumber : {
        type : String,
    },
    shipDate : {
        type : String,
    },
    shippingMethodID : {
        type : String,
    },
    freightCharge : {
        type : String,
    },
    salesTaxRate : {
        type : String,
    },
    status:{
        type: String,
        default: 'ACTIVE'
    }
});
module.exports = mongoose.model('Orders', OrderSchema);