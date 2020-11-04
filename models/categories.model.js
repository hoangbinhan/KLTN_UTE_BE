const mongoose = require('mongoose');
const CategorySchema = mongoose.Schema({
    // categoryID : {
    //     type : String,
    //     required : true,
    //     // default: ''
    // },
    categoryName : {
        type : String,
        required : true
    },
    link:{
        type:String,
        require:true
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
    sortOrder : {
        type : Number,
        required : true
    },
    children:{
        type: Array,
    },
    status:{
        type: String,
        default: 'ACTIVE'
    }
});
module.exports = mongoose.model('Categories', CategorySchema);