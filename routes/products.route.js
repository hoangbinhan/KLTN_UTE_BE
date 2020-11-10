const express = require('express');
const router = express.Router();
const ProductServices = require('../controller/product.controller')


router.get('/search/:productName', ProductServices.search)
router.get('/', ProductServices.get)
router.get('/:id', ProductServices.getById)
router.post('/', ProductServices.create)
router.put('/', ProductServices.update)
router.delete('/', ProductServices.delete)

module.exports = router;


