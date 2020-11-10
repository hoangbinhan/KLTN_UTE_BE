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
    // avatar  : m up theo cloudinary nha
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

//     static async get(req, res) {
//         BaseAPI.authorizationAPI(req, res, async () => {
//             const payload = await User.find({})
//             res.json(payload)
//         })
//     }

//     static async getById(req, res) {
//         BaseAPI.authorizationAPI(req, res, async (createdUser) => {
//             const payload = await User.find({ userID: req.params.id, createdUser: createdUser })
//             res.json(payload)
//         })
//     }

//     static async postLoginPassword(req, res) {
//         try {
//             const { email, password, isLogin } = req.body
//             res.json(await UserServices.onCreateUser({ isLogin, email, password: service.convertPasswordHMAC256(password) }))
//         } catch (error) {
//             res.status(500).send('error :' + error)
//         }
//     }

//     static async postLoginFacebook(req, res) {
//         try {
//             const { token } = req.body
//             FB.api('/me', { fields: ['userID', 'name', 'email', 'link', 'picture.type(large)'], access_token: token }, async (response) => {
//                 const { userID, name, email, picture } = response
//                 res.json(await UserServices.onCreateUser({ userID, name, email, picture: (picture && picture.data && picture.data.url) ? picture.data.url : '' }))
//             })
//         } catch (error) {
//             res.status(500).send('error :' + error)
//         }
//     }

//     static async postLoginGoogle(req, res) {
//         try {
//             const { token } = req.body
//             const response = await service.fetchAPI(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`)
//             res.json(await UserServices.onCreateUser(response))
//         } catch (error) {
//             res.status(500).send('error :' + error)
//         }
//     }

//     static async onCreateUser(response) {
//         return new Promise(async (resolve, reject) => {
//             const { userID, picture, password, email, isLogin, isLoginAdmin } = response
//             console.log(response)
//             const emailFormat = service.lowerCase(email)

//             const oldUser = password ? await User.findOne({ email: emailFormat }) : await User.findOne({ userID })

//             const jwtToken = service.generateToken(userID || emailFormat)
//             if (oldUser) {
//                 if (isLogin || isLoginAdmin) {
//                     if (oldUser.password !== password) {
//                         resolve({ errMess: 'namePwNotFound' })
//                     } else {
//                         if (isLoginAdmin) {
//                             if (oldUser.role === STATUS_TYPE.userRole.admin) {
//                                 await User.findOneAndUpdate({ userID }, { image: picture })
//                                 resolve(BaseAPI.verifyResult({ jwtToken, data: oldUser }))
//                             } else {
//                                 resolve({ errMess: 'notAdmin' })
//                             }
//                         } else {
//                             await User.findOneAndUpdate({ userID }, { image: picture })
//                             resolve(BaseAPI.verifyResult({ jwtToken, data: oldUser }))
//                         }
//                     }
//                 } else {
//                     if (password) {
//                         resolve({ errMess: 'userExisted' })
//                     } else {
//                         await User.findOneAndUpdate({ userID }, { image: picture })
//                         resolve(BaseAPI.verifyResult({ jwtToken, data: oldUser }))
//                     }
//                 }
//             } else {
//                 if (isLogin) {
//                     resolve({ errMess: 'namePwNotFound' })
//                 } else {
//                     const stateCreate = {
//                         userID : service.generateID('User'),
//                         firstName: response.family_name,
//                         lastName: response.given_name,
//                         email: emailFormat,
//                         image: picture
//                     }
//                     if (password) {
//                         stateCreate.password = password
//                     }
//                     const result = await User.create(stateCreate)
//                     resolve({ jwtToken, data: result })
//                 }
//             }
//         })
//     }

//     static async update(req, res) {
//         BaseAPI.authorizationAPI(req, res, async () => {
//             try {
//                 const { userID } = req.body
//                 const updateField = service.genUpdate(req.body,
//                     ['fullName', 'email', 'image', 'status'])
//                 await User.findOneAndUpdate({ userID }, updateField, { new: true }, (err, result) => {
//                     if (result || !err) {
//                         res.json(result)
//                     } else {
//                         res.json(false)
//                     }
//                 })
//             } catch (error) {
//                 res.status(500).send('error :' + error)
//             }
//         })
//     }

//     static async changePassword(req, res) {
//         try {
//             const { email, oldPassword, newPassword } = req.body

//             await User.findOneAndUpdate(
//                 { email, password: service.convertPasswordHMAC256(oldPassword) }, { password: service.convertPasswordHMAC256(newPassword) }, { new: true }, (err, result) => {
//                     if (result || !err) {
//                         res.json(result)
//                     } else {
//                         res.json(false)
//                     }
//                 })
//         } catch (error) {
//             res.status(500).send('error :' + error)
//         }
//     }

//     static async delete(req, res) {
//         BaseAPI.authorizationAPI(req, res, async () => {
//             try {
//                 const { userID } = req.body
//                 await User.deleteOne({ userID },{ new: true }, async (err, result) => {
//                     if (result || !err) {
//                         res.json(result)
//                     } else {
//                         res.json(false)
//                     }
//                 })
//             } catch (error) {
//                 res.send('error :' + error)
//             }
//         });
//     }
    
//     static async delete(req, res) {
//         BaseAPI.authorizationAPI(req, res, async () => {
//             try {
//                 const { userID, status } = req.body
//                 await User.findOneAndUpdate({ userID }, { status }, { new: true }, async (err, result) => {
//                     if (result || !err) {
//                         res.json(result)
//                     } else {
//                         res.json(false)
//                     }
//                 })
//             } catch (error) {
//                 res.send('error :' + error)
//             }
//         })
//     }
}
module.exports = UserServices