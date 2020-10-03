const Post = require('../models/payments.model');
const STATUS_TYPE = require('../common/constants').statusActive
const service = require('../common/function')

 class TestServices {
    //
    static async get(req, res) {
        try {
            const payload = await Post.find()
            res.json(payload)
        } catch (err) {
            res.json({ message: err })
        }
    }
    //
    static async getById(req, res) {
        try {
            const payload = await Post.findOne({ paymentID: req.params.id })
            res.json(payload)
        } catch (err) {
            res.json({ message: err });
        }
    }
    //
    static async create(req, res) {
        const post = new Post({
            // id : service.generateID(),
            paymentID: req.body.paymentID,
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
    }
    //Edit
    static async update(req, res) {
        try {
            const { paymentID } = req.body
            const updateField = service.genUpdate(req.body,
                ['paymentAmount', 'paymentDate', 'creditCardNumber', 'cardHoldersName', 'creditCardExpDate', 'status'])
            await Post.findOneAndUpdate({ paymentID }, updateField, { new: true }, (err, result) => {
                if (result || !err) {
                    res.json(result)
                } else {
                    res.json(false)
                }
            })
        } catch (error) {
            res.status(500).send('error :' + error)
        }
    }
    //Delete
    static async delete(req, res) {
        try {
            const { paymentID } = req.body
            await Post.deleteOne({ paymentID }, async (err, result) => {
                if (result || !err) {
                    res.json(result)
                } else {
                    res.json(false)
                }
            })
        } catch (error) {
            res.send('error :' + error)
        }
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
module.exports = { 
    TestServices
}