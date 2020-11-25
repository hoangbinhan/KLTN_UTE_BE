const express = require('express')
const router = express.Router()
const ChildrebServices = require('../controller/children_category.controller')

router.post('/', ChildrebServices.addNew)

module.exports = router