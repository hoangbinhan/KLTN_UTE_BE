const express = require('express');
const router = express.Router();
const CategoriesServices = require('../controller/categories.controller')
// const multerConfig = require('../common/multer');

router.get('/search/:categoryName', CategoriesServices.search)
router.get('/', CategoriesServices.get)
router.get('/:id', CategoriesServices.getById)
// router.post('/', TestServices.TestServices.create)
router.post('/', CategoriesServices.uploadIMG)
router.put('/', CategoriesServices.update)
router.delete('/', CategoriesServices.delete)

module.exports = router;


