const Order = require('../models/orders.model');
const STATUS_TYPE = require('../common/constants').statusActive
const service = require('../common/function')

class OrderServices {
    //
    static async get(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const payload = await Order.find()
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
                const payload = await Order.findOne({ orderID: req.params.id })
                res.json(payload)
            } catch (err) {
                res.json({ message: err });
            }
        // });
    }
    //
    static async create(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            const post = new Order({
                orderID: service.generateID('orderID'),
                // orderID: req.body.orderID,
                customerID: req.body.customerID,
                employeeID: req.body.employeeID,
                orderDate: req.body.orderDate,
                purchaseOrderNumber: req.body.purchaseOrderNumber,
                shipName: req.body.shipName,
                shipAddress: req.body.shipAddress,
                shipCity: req.body.shipCity,
                shipStateOrProvince: req.body.shipStateOrProvince,
                shipPostalCode: req.body.shipPostalCode,
                shipCountry: req.body.shipCountry,
                shipPhoneNumber: req.body.shipPhoneNumber,
                shipDate: req.body.shipDate,
                shippingMethodID: req.body.shippingMethodID,
                freightCharge: req.body.freightCharge,
                salesTaxRate: req.body.salesTaxRate
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
                const { orderID } = req.body
                const updateField = service.genUpdate(req.body,
                    ['orderDate', 'purchaseOrderNumber', 'shipName', 'shipAddress', 'shipCity',
                        'shipStateOrProvince', 'shipPostalCode', 'shipCountry', 'shipPhoneNumber', 'shipDate', 'freightCharge', 'salesTaxRate', 'status'])
                await Order.findOneAndUpdate({ orderID }, updateField, { new: true }, (err, result) => {
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
                const { orderID } = req.body
                await Order.deleteOne({ orderID }, async (err, result) => {
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
module.exports = OrderServices
