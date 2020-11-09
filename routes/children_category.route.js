const express = require('express')
const router = express.Router()
const TestServices = require('../controller/children_category.controller')

router.post('/', TestServices.TestServices.addNew)

module.exports = router