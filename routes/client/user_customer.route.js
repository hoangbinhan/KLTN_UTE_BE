const express = require('express');
const router = express.Router();
const UserCustomerService = require('../../controller/client/user_customer.controller');
const auth = require('../../common/auth');

router.post('/register', UserCustomerService.register);
router.post('/register-with-third-party', UserCustomerService.registerWithThirdParty);
router.post('/login', UserCustomerService.login);
router.post('/forgot-password', UserCustomerService.forgotPassword);
router.put('/update-password', auth, UserCustomerService.updatePassword);
router.post('/checkout', auth, UserCustomerService.checkout);
router.post('/response-momo', UserCustomerService.responseDataMomo)

router.post('/cart', auth, UserCustomerService.addToCart);
router.get('/cart', auth, UserCustomerService.getCart);
router.put('/cart', auth, UserCustomerService.updateCart);
router.delete('/cart', auth, UserCustomerService.deleteCart);

router.get('/orders', auth, UserCustomerService.getOrders);
router.get('/detail-order', auth, UserCustomerService.getDetailOrder);
router.get('/information', auth, UserCustomerService.getInformation);
router.put('/information', auth, UserCustomerService.updateInformation);
router.put('/change-password', auth, UserCustomerService.updatePassword);
router.post('/rating', auth, UserCustomerService.ratingProduct);
// router.get('/get-cart',serverSendEvent, UserCustomerService.getCart)

module.exports = router;
