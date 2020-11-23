const mongoose = require('mongoose');
const ProductSchema = mongoose.Schema({
    productName : {
        type : String,
        required : true
    },
    description:{
        type: String,
        required:true
    },
    quantity: {
        type: Number,
        require: true
    },
    price:{
        type: Number,
        required: true
    },
    discountPrice:{
        type: Number,
        required: true
    },
    guarantee:{
        type: Number,
        required: true
    },
    category:{
        type: [String]
    },
    status: {
        type: String, 
        required: true
    },
    image : {
        type : Array,
        required : true
    },
});
module.exports = mongoose.model('Products', ProductSchema);