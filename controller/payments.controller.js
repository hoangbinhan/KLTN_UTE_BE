const Payment = require('../models/payments.model');
const STATUS_TYPE = require('../common/constants').statusActive
const service = require('../common/function')

class PaymentServices {
    //
    static async get(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const payload = await Payment.find()
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
                const payload = await Payment.findOne({ paymentID: req.params.id })
                res.json(payload)
            } catch (err) {
                res.json({ message: err });
            }
        // });
    }
    //
    static async create(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            const post = new Payment({
                paymentID: service.generateID('paymentID'),
                // paymentID: req.body.paymentID,
                orderID: req.body.orderID,
                paymentAmount: req.body.paymentAmount,
                paymentDate: req.body.paymentDate,
                creditCardNumber: req.body.creditCardNumber,
                cardHoldersName: req.body.cardHoldersName,
                creditCardExpDate: req.body.creditCardExpDate,
                paymentMethodID: req.body.paymentMethodID
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
                const { paymentID } = req.body
                const updateField = service.genUpdate(req.body,
                    ['paymentAmount', 'paymentDate', 'creditCardNumber', 'cardHoldersName', 'creditCardExpDate', 'status'])
                await Payment.findOneAndUpdate({ paymentID }, updateField, { new: true }, (err, result) => {
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
                const { paymentID } = req.body
                await Payment.deleteOne({ paymentID }, async (err, result) => {
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
module.exports = PaymentServices
