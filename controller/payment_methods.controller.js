const Post = require('../models/payment_methods.model');
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
            const payload = await Post.findOne({ paymentMethodID: req.params.id })
            res.json(payload)
        } catch (err) {
            res.json({ message: err });
        }
    }
    //
    static async create(req, res) {
        const post = new Post({
            // id : service.generateID(),
            paymentMethodID: req.body.paymentMethodID,
            paymentMethod: req.body.paymentMethod,
            creditCard: req.body.creditCard
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
            const { paymentMethodID } = req.body
            const updateField = service.genUpdate(req.body,
                ['paymentMethod', 'creditCard', 'status'])
            await Post.findOneAndUpdate({ paymentMethodID }, updateField, { new: true }, (err, result) => {
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
            const { paymentMethodID } = req.body
            await Post.deleteOne({ paymentMethodID }, async (err, result) => {
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