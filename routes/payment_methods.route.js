const express = require('express');
const router = express.Router();
const Payment_methodServices = require('../controller/payment_methods.controller')


router.get('/', Payment_methodServices.get)
router.get('/:id', Payment_methodServices.getById)
router.post('/', Payment_methodServices.create)
router.put('/', Payment_methodServices.update)
router.delete('/', Payment_methodServices.delete)

module.exports = router;


