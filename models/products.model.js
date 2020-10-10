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
    image : {
        type : String,
        required : true
    },
    publishIdImage : {
        type : String,
        required : true
    },
    url : {
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