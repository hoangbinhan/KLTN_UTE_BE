const multer = require('multer');

var fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/upload')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    console.log('req.body', req.body)
    if (file.mimetype == "image/bmp" || file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/gif") {
        cb(null, true)
    } else {
        return cb(new Error('Only image are allowed!'))
    }
}
module.exports = multer({ storage: fileStorage, fileFilter: fileFilter }).any()