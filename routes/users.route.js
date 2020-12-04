const express = require('express');
const router = express.Router();
const UserServices = require('../controller/users.controller');
const auth = require('../common/auth');
const authAdmin = require('../common/authAdmin');

router.post('/register', UserServices.register)

router.post('/activation', UserServices.activateEmail)

router.post('/login', UserServices.login)

router.post('/refresh_token', UserServices.getAccessToken)

router.post('/forgot', UserServices.forgotPassword)

router.post('/reset', auth, UserServices.resetPassword)

router.get('/infor', auth, UserServices.getUserInfor)

router.get('/all_infor', auth, authAdmin, UserServices.getUsersAllInfor)

router.patch('/update', auth, UserServices.updateUser)

router.patch('/update_role/:id', auth, authAdmin, UserServices.updateUsersRole)

router.delete('/delete/:id', auth, authAdmin, UserServices.deleteUser)

module.exports = router;