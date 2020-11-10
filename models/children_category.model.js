const mongoose = require('mongoose');
const Children_Category = mongoose.Schema({
    childrenCategoryName : {
        type : String,
        required : true
    },
    link:{
        type:String,
        require:true
    },
    sortOrder : {
        type : Number,
        required : true
    },
    status:{
        type: String,
        default: 'ACTIVE'
    },
});
module.exports = mongoose.model('ChildrenCategory', Children_Category);