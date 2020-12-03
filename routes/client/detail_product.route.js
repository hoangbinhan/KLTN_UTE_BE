const express = require('express')
const router = express.Router()
const getDetailProduct = require('../../controller/client/detail_product.controller')

router.get('/:id', getDetailProduct)

module.exports = router