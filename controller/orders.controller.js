const Order = require('../models/orders.model');
const Customer = require('../models/customers.model')
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
            const {customerDetail} = req.body
            await Customer.findOne({phoneNumber: customerDetail.phoneNumber}, async function(err, customer){
                if(err){
                    console.log(err);
                }else{
                    if(customer){
                        console.log(customer);
                    }
                    else{
                        const post = new Customer({
                            phoneNumber:customerDetail.phoneNumber, 
                            firstName:customerDetail.firstName, 
                            lastName:customerDetail.lastName, 
                            email:customerDetail.email,
                            address:customerDetail.address
                        })
                        try {
                            await post.save();
                        } catch (err) {
                            res.json({ message: err });
                        }
                    }
                }
            })
            
            // const post = new Order({
            //    customer,
            //    status,
            //    total,
            //    createBy
            // });
            // try {
            //     const savePost = await post.save();
            //     res.json(savePost);
            // } catch (err) {
            //     res.json({ message: err });
            // }

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
