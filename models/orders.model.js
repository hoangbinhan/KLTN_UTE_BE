const mongoose = require('mongoose');
const OrderSchema = mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    total: {
        type: String,
        required: true
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateModified:{
        type: Date,
        default: Date.now
    },
    createBy:{
        type: mongoose.Types.ObjectId,
    }
});
module.exports = mongoose.model('Orders', OrderSchema);