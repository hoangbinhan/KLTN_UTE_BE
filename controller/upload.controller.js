const service = require('../common/function')
const cloudinary = require('../common/cloudinaryConfig')
const fs = require('fs');
const path = require('path');

class UploadServices {
  static async uploadImages(req, res) {
    const folderName = req.body.folderName
    const uploader = async (path) => await cloudinary.uploads(path, `KLTN/${folderName}`);
    if (req.method === 'POST') {
      const urls = []
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path)
        urls.push(newPath)
        fs.unlinkSync(path)
      }
      res.status(200).json({
        message: 'images uploaded successfully',
        data: urls
      })
    } else {
      res.status(405).json({
        err: `${req.method} method not allowed`
      })
    }
  }
}
module.exports = UploadServices