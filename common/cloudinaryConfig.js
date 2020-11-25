const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dzonl72pv',
    api_key: '222162159773353',
    api_secret: 'uFwlDHIhhU_rxYg4QYi_Z1Xj_Og',
})
exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            resolve({
                url: result.url,
                id: result.public_id
            })
        }, {
            resource_type: "auto",
            folder: folder
        })
    })
}