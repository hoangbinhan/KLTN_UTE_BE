const express = require('express')
const router = express.Router()
const getCategories = require('../../controller/client/categories.controller')
const getProduct = require('../../controller/client/products.controller')

router.get('/categories', getCategories)
router.get('/products', getProduct)