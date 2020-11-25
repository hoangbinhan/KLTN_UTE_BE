const express = require('express');
const router = express.Router();
const PaymentServices = require('../controller/payments.controller')


router.get('/', PaymentServices.get)
router.get('/:id', PaymentServices.getById)
router.post('/', PaymentServices.create)
router.put('/', PaymentServices.update)
router.delete('/', PaymentServices.delete)

module.exports = router;


