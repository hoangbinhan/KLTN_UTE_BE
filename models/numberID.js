const mongoose = require('mongoose');
const number = mongoose.Schema({
    ID : {
        type : String,
        
    },
    req : {
        type : Number
    }
});
module.exports = mongoose.model('number', number);