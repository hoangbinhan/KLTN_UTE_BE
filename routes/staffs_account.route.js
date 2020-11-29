const express = require('express');
const router = express.Router();
const StaffServices = require('../controller/staffs_account.controller');
const auth = require('../common/auth');
const authAdmin = require('../common/authAdmin');
//
router.get('/', StaffServices.getAll)

router.post('/', StaffServices.register)

router.post('/login', StaffServices.login)

router.post('/refresh_token', StaffServices.getAccessToken)

router.post('/forgot', StaffServices.forgotPassword)

router.post('/reset', auth, StaffServices.resetPassword)

router.get('/:id', auth, StaffServices.getStaffInfor)

router.get('/all_infor', auth, authAdmin, StaffServices.getStaffsAllInfor)

router.patch('/update', auth, authAdmin, StaffServices.updateStaff)

router.patch('/update_role/:id', auth, authAdmin, StaffServices.updateStaffsRole)

router.put('/', StaffServices.updateInformation)

router.delete('/delete/:id', auth, authAdmin, StaffServices.deleteStaffStatus)

module.exports = router;