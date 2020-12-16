const mongoose = require('mongoose');
const Order_detailSchema = mongoose.Schema({
    orderID : {
        type : mongoose.Types.ObjectId,
        required : true,
    },
    customerDetail:{
        address: {
            type: String,
        },
        email:{
            type: String
        },
        firstName:{
            type: String
        },
        lastName:{
            type: String
        },
        phoneNumber:{
            type: String
        }
    },
    paymentDetail:{
        address:{
            type: String
        },
        deliveryOption:{
            type: String
        },
        district:{
            type: String
        },
        ward:{
            type: String
        },
        paymentMethod:{
            type: String
        },
        provinceCity:{
            type: String
        },
    },
    productsInvoice: [Object],
    totalDetail:{
        note:{
            type: String
        },
        shippingFee:{
            type: String
        },
        subTotal:{
            type: String
        },
        total:{
            type: String
        },
        unitOrder:{
            type: String
        },
    }
});
module.exports = mongoose.model('Order_details', Order_detailSchema);