const express = require('express');
const router = express.Router();
const Order_detailServices = require('../controller/orders_detail.controller')


router.get('/', Order_detailServices.get)
router.get('/:id', Order_detailServices.getById)
router.post('/', Order_detailServices.create)
router.put('/', Order_detailServices.update)
router.delete('/', Order_detailServices.delete)

module.exports = router;


