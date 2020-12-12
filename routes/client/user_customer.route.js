const express = require('express')
const router = express.Router()
const UserCustomerService = require('../../controller/client/user_customer.controller')
const auth = require('../../common/auth')

router.post('/register', UserCustomerService.register)
router.post('/login', UserCustomerService.login)
router.post('/forgot-password', UserCustomerService.forgotPassword)
router.put('/update-password', auth, UserCustomerService.updatePassword)

router.post('/cart', UserCustomerService.addToCart)
router.get('/cart', UserCustomerService.getCart)
router.put('/cart', UserCustomerService.updateCart)
router.delete('/cart',UserCustomerService.deleteCart)

// router.get('/get-cart',serverSendEvent, UserCustomerService.getCart)

module.exports = router