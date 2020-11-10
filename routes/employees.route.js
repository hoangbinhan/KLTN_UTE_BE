const express = require('express');
const router = express.Router();
const EmployeeServices = require('../controller/employees.controller')


router.get('/', EmployeeServices.get)
router.get('/:id', EmployeeServices.getById)
router.post('/', EmployeeServices.create)
router.put('/', EmployeeServices.update)
router.delete('/', EmployeeServices.delete)
router.delete('/:id', EmployeeServices.deletestatus)


module.exports = router;


