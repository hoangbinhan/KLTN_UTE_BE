const express = require('express')
const router = express.Router()
const getCategories = require('../../controller/client/categories.controller')

router.get('/', getCategories)