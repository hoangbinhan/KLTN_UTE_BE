const express = require('express')
const router = express.Router()
const UserCustomerService = require('../../controller/client/user_customer.controller')
const serverSendEvent = require('../../common/serverSendEvent')

router.post('/register', UserCustomerService.register)
router.post('/login', UserCustomerService.login)
router.post('/add-to-cart', UserCustomerService.addToCart)
router.get('/get-cart', UserCustomerService.getCart)
router.put('/update-cart', UserCustomerService.updateCart)
router.delete('/delete-cart',UserCustomerService.deleteCart)

// router.get('/get-cart',serverSendEvent, UserCustomerService.getCart)

module.exports = router