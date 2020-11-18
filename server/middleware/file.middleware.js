const multer = require('multer')
const moment = require('moment')

const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'images')
    },
    filename(req, file, cb) {
        cb(null, moment().format('DD-MM-YYYY_HH-mm-ss_SSS') + '&' + file.originalname)
    },
})

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

module.exports = multer({
    storage,
    fileFilter,
})
