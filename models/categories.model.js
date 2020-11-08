const mongoose = require('mongoose');
const CategorySchema = mongoose.Schema({

    categoryName : {
        type : String,
        required : true
    },
    link:{
        type:String,
        require:true
    },
    image : {
        type : Object,
        required : true
    },
    sortOrder : {
        type : Number,
        required : true
    },
    children:{
        type: [{type:mongoose.Schema.Types.ObjectId}],
    },
    status:{
        type: String,
        default: 'ACTIVE'
    },
    imageUrl:{
        type: String,
        required: true
    },
    imageId: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Categories', CategorySchema);