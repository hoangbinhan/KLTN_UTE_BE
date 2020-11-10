const Customer = require('../models/customers.model');
const STATUS_TYPE = require('../common/constants').statusActive
const service = require('../common/function')
const BaseAPI = require('../common/token');

class CustomerServices {
    //
    static async get(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const payload = await Customer.find()
                res.json(payload)
            } catch (err) {
                res.json({ message: err })
            }
        // });
    }
    //
    static async getById(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const payload = await Customer.findOne({ customerID: req.params.id })
                res.json(payload)
            } catch (err) {
                res.json({ message: err });
            }
        // });
    }
    //
    static async create(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            const post = new Customer({
                customerID: service.generateID('customer'),
                companyName: req.body.companyName,
                contactFirstname: req.body.contactFirstname,
                contactLastname: req.body.contactLastname,
                billingAddress: req.body.billingAddress,
                city: req.body.city,
                stateOrProvince: req.body.stateOrProvince,
                postalCode: req.body.postalCode,
                country: req.body.country,
                contactTitle: req.body.contactTitle,
                phoneNumber: req.body.phoneNumber,
                faxNumber: req.body.faxNumber
            });
            try {
                const savePost = await post.save();
                res.json(savePost);
            } catch (err) {
                res.json({ message: err });
            }
        // });
    }
    //Edit
    static async update(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const { customerID } = req.body
                const updateField = service.genUpdate(req.body,
                    ['companyName', 'contactFirstname', 'contactLastname', 'billingAddress', 'city',
                        'stateOrProvince', 'postalCode', 'country', 'contactTitle', 'phoneNumber', 'faxNumber', 'status'])
                await Customer.findOneAndUpdate({ customerID }, updateField, { new: true }, (err, result) => {
                    if (result || !err) {
                        res.json(result)
                    } else {
                        res.json(false)
                    }
                })
            } catch (error) {
                res.status(500).send('error :' + error)
            }
        // });
    }
    //Delete
    static async delete(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const { customerID } = req.body
                await Customer.deleteOne({ customerID }, async (err, result) => {
                    if (result || !err) {
                        res.json(result)
                    } else {
                        res.json(false)
                    }
                })
            } catch (error) {
                res.send('error :' + error)
            }
        // });
    }
    //Delete Status
    // static async deletestatus(req, res) {
    //     try {
    //         const id = req.params.id
    //         const payload = await Post.findOneAndUpdate({ id }, { status: 'INACTIVE' })
    //         if (!payload) {
    //             return res.json(false)
    //         }
    //         res.json(payload)
    //     } catch (error) {
    //         res.send('error :' + error)
    //     }
    // }
}
module.exports = CustomerServices