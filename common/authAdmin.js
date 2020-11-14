// const { admin } = require('googleapis/build/src/apis/admin')
const constant = require('../common/constants');
const Staff = require('../models/staffs.model')

const authAdmin = async (req, res, next) => {
    try {
        const staffs = await Staff.findOne({staffID: req.staff.id})
        console.log(staffs)
        if(staffs.role !== 'admin') 
            return res.status(500).json({msg: "Admin resources access denied."}) 
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin