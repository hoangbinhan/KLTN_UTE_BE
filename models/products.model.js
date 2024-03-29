const mongoose = require('mongoose');
const ProductSchema = mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  detailDescription: {
    type: String,
  },
  quantity: {
    type: Number,
    require: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
  },
  guarantee: {
    type: Number,
    required: true,
  },
  category: {
    type: [String],
  },
  status: {
    type: String,
    default: 'ACTIVE',
  },
  image: {
    type: Array,
    required: true,
  },
  rating: {
    type: Number,
    default: 5,
  },
  comment: [Object],
});
module.exports = mongoose.model('Products', ProductSchema);
