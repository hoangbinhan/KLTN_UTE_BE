const express = require('express');
const router = express.Router();
const UploadServices = require('../controller/upload.controller')
const upload = require('../common/multer')

router.post('/images',upload.array('image'), UploadServices.uploadImages)

module.exports = router;


    