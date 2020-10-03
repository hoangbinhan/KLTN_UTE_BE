const mongoose = require('mongoose');
const Order_detailSchema = mongoose.Schema({
    orderDetailID : {
        type : String,
        required : true,
        // default: ''
    },
    orderID : {
        type : String,
        required : true,
        // default: ''
    },
    productID : {
        type : String,
        required : true,
        // default: ''
    },
    quantity : {
        type : String,
        required : true
    },
    unitPrice : {
        type : String,
        required : true
    },
    discount : {
        type : String,
        required : true
    },
    status:{
        type: String,
        default: 'ACTIVE'
    }
});
module.exports = mongoose.model('Order_details', Order_detailSchema);