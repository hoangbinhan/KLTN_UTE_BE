const Payment_method = require('../models/payment_methods.model');
const STATUS_TYPE = require('../common/constants').statusActive
const service = require('../common/function')
const BaseAPI = require('../common/token');

class Payment_methodServices {
    //
    static async get(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const payload = await Payment_method.find()
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
                const payload = await Payment_method.findOne({ paymentMethodID: req.params.id })
                res.json(payload)
            } catch (err) {
                res.json({ message: err });
            }
        // });
    }
    //
    static async create(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            const post = new Payment_method({
                paymentMethod: req.body.paymentMethod,
                creditCard: req.body.status
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
                const { _id } = req.body
                await Payment_method.findOneAndUpdate({ _id }, req.body, { new: true }, (err, result) => {
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
                const { _id } = req.body
                await Payment_method.deleteOne({ _id }, async (err, result) => {
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
}
module.exports = Payment_methodServices
