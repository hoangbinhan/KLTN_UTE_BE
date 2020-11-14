const Product = require('../models/products.model');
// const STATUS_TYPE = require('../common/constants').statusActive
const service = require('../common/function');


class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObj = { ...this.queryString };
        console.log(queryObj);
        const excludedfields = ['page', 'sort', 'limit'];
        excludedfields.forEach(el => delete queryObj[el]);
        let querystr = JSON.stringify(queryObj);
        querystr = querystr.replace(/\b(gte|gt|lt|lte)\b/g, match => `$${match}`);
        this.query.find(JSON.parse(querystr));
        return this;
    }
    sorting() {
        if (this.queryString.sort) {
            const sortby = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortby);
        } else {
            this.query = this.query.sort('-createAt');
        }
        return this;
    }
    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 4;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
class ProductServices {
    //Search
    static async search(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            var regex = new RegExp(req.params.productName, 'i');
            Product.find({ productName: regex }).then((result) => {
                res.status(200).json(result);
            })
        // });
    }
    //GetALL
    static async get(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const features = new APIfeatures(Product.find(), req.query)
                    .filtering()
                    .sorting()
                    .paginating();
                const payload = await features.query;
                res.status(200).json({
                    status: 'success',
                    result: payload.length,
                    data: {
                        payload
                    }
                });
            } catch (err) {
                res.status(400).json({
                    status: 'fail',
                    message: err
                });
            }
        // });
    }
    // getID
    static async getById(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const payload = await Product.findOne({ productID: req.params.id })
                res.status(200).json({
                    status: 'success',
                    result: payload.length,
                    data: {
                        payload
                    }
                });
            } catch (err) {
                res.status(400).json({
                    status: 'fail',
                    message: err
                });
            }
        // });
    }
    // Multer IMG
    static async create(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {

            var post = new Product({
                productID: service.generateID('productID'),
                productName: req.body.productName,
                images: req.body.images,
                unitPrice: req.body.unitPrice
            });
            try {
                const savePost = await post.save();
                res.status(200).json({
                    status: 'success',
                    data: savePost
                });
            } catch (err) {
                res.status(400).json({
                    status: 'fail',
                    message: err
                });
            }
        // });
    }
    //Edit
    static async update(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
            try {
                const { productID } = req.body
                const updateField = service.genUpdate(req.body,
                    ['productName', 'unitPrice', 'status', 'images'])
                await Product.findOneAndUpdate({ productID }, updateField, { new: true }, (err, result) => {
                    if (result || !err) {
                        res.status(200).json({
                            status: 'success',
                            data: result
                        });
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
                const { productID } = req.body
                await Product.deleteOne({ productID }, async (err, result) => {
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
module.exports = ProductServices