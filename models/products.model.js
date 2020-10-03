const mongoose = require('mongoose');
const ProductSchema = mongoose.Schema({
    productID : {
        type : String,
        required : true,
        // default: ''
    },
    productName : {
        type : String,
        required : true
    },
    unitPrice : {
        type : String,
        required : true
    },
    status:{
        type: String,
        default: 'ACTIVE'
    }
});
module.exports = mongoose.model('Products', ProductSchema);