const Order_detail = require('../models/orders_detail.model');
const STATUS_TYPE = require('../common/constants').statusActive
const service = require('../common/function')

class Order_detailServices {
    static async get(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const payload = await Order_detail.find()
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
                const payload = await Order_detail.findOne({ orderDetailID: req.params.id })
                res.json(payload)
            } catch (err) {
                res.json({ message: err });
            }
        // });
    }
    //
    static async create(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            const post = new Order_detail({
                // id : service.generateID(),
                orderDetailID: service.generateID('orderDetailID'),
                // orderDetailID: req.body.orderDetailID,
                orderID: req.body.orderID,
                productID: req.body.productID,
                quantity: req.body.quantity,
                unitPrice: req.body.unitPrice,
                discount: req.body.discount
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
                const { orderDetailID } = req.body
                const updateField = service.genUpdate(req.body,
                    ['quantity', 'unitPrice', 'discount', 'status'])
                await Order_detail.findOneAndUpdate({ orderDetailID }, updateField, { new: true }, (err, result) => {
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
                const { orderDetailID } = req.body
                await Order_detail.deleteOne({ orderDetailID }, async (err, result) => {
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
module.exports = Order_detailServices
