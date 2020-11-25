const staffs_account = require('../models/staffs_account.model');
const service = require('../common/function');
const bcrypt = require('bcrypt');
const sendMail = require('./sendMail.controller');
const jwt = require('jsonwebtoken');
//

const { CLIENT_URL } = process.env

const StaffAccountServices = {
    search: async (req, res) => {
        try {
            var regex = new RegExp(req.params.name, 'i');
            Staff.find({ name: regex }).then((result) => {
                res.status(200).json(result);
            })
        }catch{
            return res.status(500).json({ msg: err.message})
        }
    },

    //register
    register: async (req, res) => {
        try {
            const { username, password, role, status, firstName, lastName, phoneNumber, address, email } = req.body
            if (!username || !password )
                return res.status(400).json({ msg: "Please fill in all fields!" })
            const staff = await staffs_account.findOne({ username })
            if (staff) return res.status(400).json({ msg: "This email already exists." })
            if (password.length < 6)
                return res.status(400).json({ msg: "Pass word must be at least 6 characters" })
            const passwordHash = await bcrypt.hash(password, 12)
            const newStaff = new staffs_account(
                {
                    username,
                    password: passwordHash, 
                    role, 
                    status,
                    firstName,
                    lastName,
                    phoneNumber,
                    address,
                    email
                }
            ) 
            await newStaff.save()
            res.status(200).json({
                status: 'success'
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },


    activateEmail: async (req, res) => {
        try {
            const { activation_token } = req.body
            const staff = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const { staffID, name, email, password } = staff

            const check = await Staff.findOne({ email })
            if (check) return res.status(400).json({ msg: "This email already exists." })

            const newStaff = new Staff({
                staffID, name, email, password
            })

            await newStaff.save()

            res.json({ msg: "Account has been activated!" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body
            const staff = await staffs_account.findOne({ username })
            if (!staff) return res.status(400).json({ msg: "This user does not exist." })
            const isMatch = await bcrypt.compare(password, staff.password)
            if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })
            const refresh_token = service.createRefreshToken({ username: staff.username })
            const create_token = service.createAccessToken({ username:staff.username, role: staff.role })
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/staff/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            res.status(200).json({
                status: 'Login success!',
                token: create_token,
                refresh_token
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token) return res.status(400).json({ msg: "Please login now!" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, staff) => {
                if (err) return res.status(400).json({ msg: "Please login now!" })

                const access_token = service.createAccessToken({ id: staff.id })
                res.status(200).json({
                    status: "gettoken success",
                    refresh_token : access_token 
                })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const staff = await Staff.findOne({ email })
            if (!staff) return res.status(400).json({ msg: "This email does not exist." })

            const access_token = service.createAccessToken({ id: staff.staffID })
            const url = `${CLIENT_URL}/api/staff/reset/${access_token}`

            sendMail(email, url, "Reset your password")
            res.json({ msg: "Re-send the password, please check your email." })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    resetPassword: async (req, res) => {
        try {
            const { password } = req.body
            // console.log(password)
            const passwordHash = await bcrypt.hash(password, 12)
            // console.log(req.user)
            await Staff.findOneAndUpdate({ staffID: req.staff.id }, {
                password: passwordHash
            })
            res.json({ msg: "Password successfully changed!" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },

    getStaffInfor: async (req, res) => {
        try {
            const staff = await Staff.findOne({ staffID: req.staff.id }).select('-password')
            // console.log(user);
            res.json(staff)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getStaffsAllInfor: async (req, res) => {
        try {
            console.log(req.staff)
            const staffs = await Staff.find().select('-password')
            res.json(staffs)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    // avatar  
    updateStaff: async (req, res) => {
        try {
            const { staffID } = req.body
            const updateField = service.genUpdate(req.body,
                ['name','status'])
            await Staff.findOneAndUpdate({ staffID }, updateField, { new: true }, (err, result) => {
                if (result || !err) {
                    res.json(result)
                } else {
                    res.json(false)
                }
            })
            } catch (err) {
                return res.status(500).json({ msg: err.message })
            }
        },
        updateStaffsRole: async (req, res) => {
            try {
                const { role } = req.body

                await Staff.findOneAndUpdate({ staffID: req.params.id }, {
                    role
                })

                res.json({ msg: "Update Success!" })
            } catch (err) {
                return res.status(500).json({ msg: err.message })
            }
        },
            deleteStaff: async (req, res) => {
                try {
                    const { staffID } = req.body
                    await Staff.deleteOne({ staffID }, async (err, result) => {
                        if (result || !err) {
                            res.json(result)
                        } else {
                            res.json(false)
                        }
                    })
                } catch (error) {
                    res.send('error :' + error)
                }
            },
                deleteStaffStatus: async (req, res) => {
                    try {
                        const { staffID } = req.body
                        await Staff.findOneAndUpdate({ staffID }, { status: 'INACTIVE' }, { new: true }, async (err, result) => {
                            if (result || !err) {
                                console.log(result)
                                res.json(result)
                            } else {
                                res.json(false)
                            }
                        })

                    } catch (error) {
                        res.send('error :' + error)
                    }
                }

    }
module.exports = StaffAccountServices