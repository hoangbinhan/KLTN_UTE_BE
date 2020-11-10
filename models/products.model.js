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
<<<<<<< HEAD
    images : {
        type : Array,
        required : true
=======
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
    status: {
        type: String, 
        required: true
    },
    image : {
        type : String,
        required : true
    },
    detailDescription:{
        type : String,
    },
    detailConfiguration:{
        type: Array
>>>>>>> develop
    },
    picture: {
        type: Array,
        required: true
    },
});
module.exports = mongoose.model('Products', ProductSchema);