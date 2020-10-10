const express = require('express');
const router = express.Router();
const TestServices = require('../controller/product.controller')
const multerConfig = require('../common/multer');


router.get('/search/:productName', TestServices.TestServices.search)
router.get('/', TestServices.TestServices.get)
router.get('/:id', TestServices.TestServices.getById)
// router.post('/', TestServices.TestServices.create)
router.post('/',multerConfig, TestServices.TestServices.uploadIMG)
router.put('/', multerConfig, TestServices.TestServices.update)
router.delete('/', TestServices.TestServices.delete)

module.exports = router;


