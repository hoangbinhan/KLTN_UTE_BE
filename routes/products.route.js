const express = require('express');
const router = express.Router();
const ProductServices = require('../controller/product.controller')
const auth = require('../common/auth');
const authAdmin = require('../common/authAdmin');


router.get('/search/:productName', ProductServices.search)
router.get('/', auth,authAdmin, ProductServices.get)
router.get('/:id', ProductServices.getById)
router.post('/', ProductServices.create)
router.put('/', ProductServices.update)
router.delete('/', ProductServices.delete)

module.exports = router;


