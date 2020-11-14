const Shipping = require('../models/shipping_methods.model');
const STATUS_TYPE = require('../common/constants').statusActive
const service = require('../common/function')

class ShippingServices {
    //
    static async get(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const payload = await Shipping.find()
                res.json(payload)
            } catch (err) {
                res.json({ message: err })
            }
        // });
    }
    static async getById(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const payload = await Shipping.findOne({ shippingMethodID: req.params.id })
                res.json(payload)
            } catch (err) {
                res.json({ message: err });
            }
        // });
    }
    //
    static async create(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            let {shippingMethod, shippingFee, status} = req.body
            const post = new Shipping({
                shippingMethod,
                shippingFee,
                status
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
                await Shipping.findOneAndUpdate({ _id }, req.body, { new: true }, (err, result) => {
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
                await Shipping.deleteOne({ _id }, async (err, result) => {
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
module.exports = ShippingServices
