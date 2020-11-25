const Staff = require('../models/staffs.model');
const STATUS_TYPE = require('../common/constants');
const service = require('../common/function');
const bcrypt = require('bcrypt');
const sendMail = require('./sendMail.controller');
const jwt = require('jsonwebtoken');
const { result } = require('lodash');
//

const { CLIENT_URL } = process.env
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObj = { ...this.queryString };
        console.log(queryObj);
        const excludedfields = ['page', 'sort', 'limit'];
        excludedfields.forEach(el => delete queryObj[el]);
        let querystr = JSON.stringify(queryObj);
        querystr = querystr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
        this.query.find(JSON.parse(querystr));
        return this;
    }
    sorting() {
        if (this.queryString.sort) {
            const sortby = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortby);
        } else {
            this.query = this.query.sort('-createAt');
        }
        return this;
    }
    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 4;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
const StaffServices = {
    search: async (req, res) => {
        try {
            var regex = new RegExp(req.params.name, 'i');
            Staff.find({ name: regex }).then((result) => {
                res.status(200).json(result);
            })
        } catch {
            return res.status(500).json({ msg: err.message })
        }
    },
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body
            if (!name || !email || !password)
                return res.status(400).json({ msg: "Please fill in all fields!" })
            if (!service.validateEmail(email))
                return res.status(400).json({ msg: "Invalid emails." })
            const staff = await Staff.findOne({ email })
            if (staff) return res.status(400).json({ msg: "This email already exists." })
            if (password.length < 6)
                return res.status(400).json({ msg: "Pass word must be at least 6 characters" })
            const passwordHash = await bcrypt.hash(password, 12)
            const newStaff = {
                staffID: service.generateID('Staff'),
                name, email, password: passwordHash
            }
            const activation_token = service.createActivationToken(newStaff);
            const url = `${CLIENT_URL}/api/staff/activate/${activation_token}`
            sendMail(email, url, "Verify your email address")

            res.json({ msg: "Register Success! Please activate your email to start" })


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
            const { email, password } = req.body
            const staff = await Staff.findOne({ email })
            if (!staff) return res.status(400).json({ msg: "This email does not exist." })

            const isMatch = await bcrypt.compare(password, staff.password)
            if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })
            // console.log(user)
            const refresh_token = service.createRefreshToken({ id: staff.staffID })
            const create_token = service.createAccessToken({ id: staff.staffID })
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/staff/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            res.status(200).json({
                status: 'Login success!',
                token: {
                    create_token,
                    refresh_token
                }
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
                    refresh_token: access_token
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
            const feature = new APIfeatures(Staff.findOne({ staffID: req.staff.id }).select('-password'), req.query)
            .filtering()
            .sorting()
            // const staff = await Staff.findOne({ staffID: req.staff.id }).select('-password')
            const staff = await feature.query

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
            // const { name, avatar } = req.body
            // await Staff.findOneAndUpdate({ staffID: req.staff.id }, {
            //     name, // avatar
            // })
            // res.json({ msg: "Update Success!" })
            const { staffID } = req.body
            const updateField = service.genUpdate(req.body,
                ['name', 'status'])
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
            // const { userID } = req.body
            // await Staff.findByIdAndDelete(req.params.id, async (err, result) => {
            //     console.log(staff)
            // if (result || !err) {
            //     res.json(result)
            // } else {
            //     res.json(false)
            // }

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
module.exports = StaffServices