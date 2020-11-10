// const { admin } = require('googleapis/build/src/apis/admin')
const constant = require('../common/constants');
const User = require('../models/users.model')

const authAdmin = async (req, res, next) => {
    try {
        const users = await User.find({_id: req.user.id})
        console.log(users)
        if(users.role !== 'admin') // Check chỗ này bị lỗi, tại role: member thì oke, khi đổi member thành admin thì nó k check được
            return res.status(500).json({msg: "Admin resources access denied."})
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin