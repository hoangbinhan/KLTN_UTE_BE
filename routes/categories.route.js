const express = require('express');
const router = express.Router();
const TestServices = require('../controller/categories.controller')
const multerConfig = require('../common/multer');

router.get('/search/:categoryName', TestServices.TestServices.search)
router.get('/', TestServices.TestServices.get)
router.get('/:id', TestServices.TestServices.getById)
// router.post('/', TestServices.TestServices.create)
router.post('/', TestServices.TestServices.uploadIMG)
router.put('/', multerConfig, TestServices.TestServices.update)
router.delete('/', TestServices.TestServices.delete)

module.exports = router;


