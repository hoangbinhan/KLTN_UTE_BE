const express = require('express');
const router = express.Router();
const ShippingServices = require('../controller/shipping_methods.controller')


router.get('/', ShippingServices.get)
router.get('/:id', ShippingServices.getById)
router.post('/', ShippingServices.create)
router.put('/', ShippingServices.update)
router.delete('/', ShippingServices.delete)

module.exports = router;


