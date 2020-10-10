const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})
exports.upload = (file) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({ url: result.url, id: result.public_id })
        }, { resource_type: "auto" })
    })
}

exports.delete = (publishId) => {
    return new Promise(resolve => {
        cloudinary.uploader.destroy(publishId, result =>{
            resolve(result)
        })
    })
}
