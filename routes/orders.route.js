const express = require('express');
const router = express.Router();
const OrderServices = require('../controller/orders.controller')


router.get('/', OrderServices.get)
router.get('/:id', OrderServices.getById)
router.post('/', OrderServices.create)
router.put('/', OrderServices.update)
router.delete('/', OrderServices.delete)

module.exports = router;


