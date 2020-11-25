// const { admin } = require('googleapis/build/src/apis/admin')
const constant = require('../common/constants');
const StaffAccount = require('../models/staffs_account.model')

const authAdmin = async (req, res, next) => {
    try {
        const staffs = await StaffAccount.findOne({username: req.staff.username})
        if(staffs.role !== 'admin') 
            return res.status(500).json({msg: "Admin resources access denied."}) 
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin