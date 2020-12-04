const BaseAPI = require('../common/token');
const User = require('../models/users.model');
const STATUS_TYPE = require('../common/constants');
const service = require('../common/function');
const bcrypt = require('bcrypt');
const sendMail = require('./sendMail.controller');
const jwt = require('jsonwebtoken');
//

const { CLIENT_URL } = process.env

const UserServices =  {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body
            if (!name || !email || !password)
                return res.status(400).json({ msg: "Please fill in all fields!" })
            if (!service.validateEmail(email))
                return res.status(400).json({ msg: "Invalid emails." })
            const user = await User.findOne({ email })
            if (user) return res.status(400).json({ msg: "This email already exists." })
            if (password.length < 6)
                return res.status(400).json({ msg: "Pass word must be at least 6 characters" })
            const passwordHash = await bcrypt.hash(password, 12)
            const newUser = {
                userID: service.generateID('User'),
                name, email, password: passwordHash
            }
            const activation_token = service.createActivationToken(newUser);
            const url = `${CLIENT_URL}/api/user/activate/${activation_token}`
            sendMail(email, url, "Verify your email address")

            res.json({ msg: "Register Success! Please activate your email to start" })


        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    activateEmail: async (req, res) => {
        try {
            const { activation_token } = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            const { userID, name, email, password } = user

            const check = await User.findOne({ email })
            if (check) return res.status(400).json({ msg: "This email already exists." })

            const newUser = new User({
                userID, name, email, password
            })

            await newUser.save()

            res.json({ msg: "Account has been activated!" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) return res.status(400).json({ msg: "This email does not exist." })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })
            console.log(user)
            const refresh_token = service.createRefreshToken({ id: user.userID })

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })

            res.json({ msg: "Login success!" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token) return res.status(400).json({ msg: "Please login now!" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Please login now!" })

                const access_token = service.createAccessToken({ id: user.userID })
                res.json({ access_token })
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body
            const user = await User.findOne({ email })
            if (!user) return res.status(400).json({ msg: "This email does not exist." })

            const access_token = service.createAccessToken({ id: user.userID })
            const url = `${CLIENT_URL}/api/user/reset/${access_token}`

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
            await User.findOneAndUpdate({userID: req.user.id}, {
                password: passwordHash
            })
            res.json({msg: "Password successfully changed!"})
               
            } catch (err) {
                return res.status(500).json({ msg: err.message })
            }
    },
    getUserInfor: async (req, res) => {
        try {
            const user = await User.findOne(req.user.id).select('-password')
            // console.log(user);
            res.json(user)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getUsersAllInfor: async (req, res) => {
        try {
            console.log(req.user)
            const users = await User.find().select('-password')

            res.json(users)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
   
    updateUser: async (req, res) => {
        try {
            const {name, avatar} = req.body
            await User.findOneAndUpdate({_id: req.user.id}, {
                name, // avatar
            })

            res.json({msg: "Update Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    updateUsersRole: async (req, res) => {
        try {
            const {role} = req.body

            await User.findOneAndUpdate({_id: req.params.id}, {
                role
            })

            res.json({msg: "Update Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    deleteUser: async (req, res) => {
        try {
            await User.findByIdAndDelete(req.params.id)

            res.json({msg: "Deleted Success!"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }


}
module.exports = UserServices