const express = require('express');
const router = express.Router();
const TestServices = require('../controller/payments.controller')


router.get('/', TestServices.TestServices.get)
router.get('/:id', TestServices.TestServices.getById)
router.post('/', TestServices.TestServices.create)
router.put('/', TestServices.TestServices.update)
router.delete('/', TestServices.TestServices.delete)

module.exports = router;


