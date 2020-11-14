const express = require('express');
const router = express.Router();
const ProductServices = require('../controller/product.controller')
const auth = require('../common/auth');
const authAdmin = require('../common/authAdmin');


router.get('/search/:productName',auth, ProductServices.search)
router.get('/', auth, ProductServices.get)
router.get('/:id',auth, ProductServices.getById)
router.post('/',auth,authAdmin, ProductServices.create)
router.put('/',auth, authAdmin, ProductServices.update)
router.delete('/',auth, authAdmin, ProductServices.delete)

module.exports = router;


