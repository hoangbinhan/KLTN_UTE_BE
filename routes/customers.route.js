const express = require('express');
const router = express.Router();
const CustomerServices = require('../controller/customers.controller')


router.get('/', CustomerServices.get)
router.get('/:id', CustomerServices.getById)
router.post('/', CustomerServices.create)
router.put('/', CustomerServices.update)
router.delete('/', CustomerServices.delete)

module.exports = router;


