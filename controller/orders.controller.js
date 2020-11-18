const Order = require('../models/orders.model');
const Customer = require('../models/customers.model')
const Order_Detail = require('../models/orders_detail.model')
const Product = require('../models/products.model')
const STATUS_TYPE = require('../common/constants').statusActive
const service = require('../common/function')

class OrderServices {
    //
    static async get(req, res) {
        try{
            Order.aggregate([
                {
                    $lookup:{
                        from: 'customers',
                        localField: 'customer',
                        foreignField: '_id',
                        as: 'customerDetail'
                    }
                }
            ]).exec(function(err, data){
                if(err) res.status(400).json({message: err.message})
                return res.status(200).json({
                    data
                })
            })
        }catch(err){
            res.status(400).json({
                status:'fail',
                message: err.message
            })
        }
    }
    //
    static async getById(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const payload = await Order_Detail.findOne({ orderID: req.params.id })
                res.json(payload)
            } catch (err) {
                res.json({ message: err });
            }
        // });
    }
    //
    static async create(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            let {customerDetail, productsInvoice, paymentDetail, totalDetail} = req.body
            var idCustomer = ''
            try{
                await Customer.findOne({phoneNumber: customerDetail.phoneNumber}, async function(err, customer){
                    if(err){
                        res.status(400).json({message: err.message})
                    }else{
                        if(customer){
                            idCustomer =  customer._id
                            const postOrder = new Order({
                                customer: idCustomer,
                                total: totalDetail.total
                            })
                            await postOrder.save((err)=>{
                                if(err){
                                    res.status(400).json({err: err.message, postSave: 'err in postSave'})
                                }else{
                                    Customer.findOneAndUpdate({_id: idCustomer}, {$push:{invoices:postOrder._id}}, async (err)=>{
                                        if(err){
                                            res.status(400).json({err:err.message})
                                        }else{
                                            try{
                                                for(let i = 0;i<productsInvoice.length;i++){
                                                    const storedProduct =  await Product.findOne({_id:productsInvoice[i]._id})
                                                    const isSoldOut = await storedProduct.quantity - productsInvoice[i].quantity
                                                    if(isSoldOut<0){
                                                        res.status(400).json({message: 'product is sold out!'})
                                                    }
                                                    else{
                                                        try{
                                                            await Product.findOneAndUpdate({_id:productsInvoice[i]._id}, {quantity: isSoldOut})
                                                        }catch(err){
                                                            res.status(400).json({message: err.message})
                                                        }
                                                    }
                                                }
                                                try{
                                                    const postDetail = new Order_Detail({
                                                        orderID: postOrder._id,
                                                        customerDetail,
                                                        productsInvoice, 
                                                        paymentDetail, 
                                                        totalDetail
                                                    })
                                                    await postDetail.save()
                                                    res.status(200).json({message:'successful'})
                                                }catch(err){
                                                    res.status(400).json({message: err.message})
                                                }
                                            }catch(err){
                                                res.status(400).json({message: err.message})
                                            }
                                        }
                                    })
                                }
                            })
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
                                post.save(async (err)=>{
                                    if(err) res.status(400).json({message: err.message})
                                    idCustomer = post._id
                                    const postOrder = new Order({
                                        customer: idCustomer,
                                        total: totalDetail.total
                                    })
                                    await postOrder.save((err)=>{
                                        if(err){
                                            res.status(400).json({err: err.message, postSave: 'err in postSave'})
                                        }else{
                                            Customer.findOneAndUpdate({_id: idCustomer}, {$push:{invoices:postOrder._id}}, async (err)=>{
                                                if(err){
                                                    res.status(400).json({err:err.message})
                                                }else{
                                                    try{
                                                        for(let i = 0;i<productsInvoice.length;i++){
                                                            const storedProduct =  await Product.findOne({_id:productsInvoice[i]._id})
                                                            const isSoldOut = await storedProduct.quantity - productsInvoice[i].quantity
                                                            if(isSoldOut<0){
                                                                res.status(400).json({message: 'product is sold out!'})
                                                            }
                                                            else{
                                                                try{
                                                                    await Product.findOneAndUpdate({_id:productsInvoice[i]._id}, {quantity: isSoldOut})
                                                                }catch(err){
                                                                    res.status(400).json({message: err.message})
                                                                }
                                                            }
                                                        }
                                                        try{
                                                            const postDetail = new Order_Detail({
                                                                orderID: postOrder._id,
                                                                customerDetail,
                                                                productsInvoice, 
                                                                paymentDetail, 
                                                                totalDetail
                                                            })
                                                            await postDetail.save()
                                                            res.status(200).json({message:'successful'})
                                                        }catch(err){
                                                            res.status(400).json({message: err.message})
                                                        }
                                                    }catch(err){
                                                        res.status(400).json({message: err.message})
                                                    }
                                                }
                                            })
                                        }
                                    })
                                });
                            } catch (err) {
                                res.status(400).json({ message: err });
                            }
                        }
                    }
                })
            }catch(err){
                res.status(400).json({message: err.message})
            }
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
