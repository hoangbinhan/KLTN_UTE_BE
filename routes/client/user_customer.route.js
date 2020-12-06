const express = require('express')
const router = express.Router()
const UserCustomerService = require('../../controller/client/user_customer.controller')

router.post('/register', UserCustomerService.register)
router.post('/login', UserCustomerService.login)
router.post('/add-to-cart', UserCustomerService.addToCart)

module.exports = router