const Product = require('../models/products.model');
const Categories = require('../models/categories.model')
// const STATUS_TYPE = require('../common/constants').statusActive
const cloud = require('../common/cloudinaryConfig');


class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filtering() {
        const queryObj = { ...this.queryString };
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
        try {
            Product.aggregate([
                {$lookup:{
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'model'
                }}
            ]).exec(function(err, data){
                if(err)return
                return res.status(200).json({
                    status:'success',
                    result: data.length,
                    data
                })
            })
        } catch (err) {
            res.status(400).json({
                status: 'fail',
                message: err
            });
        }
    }
    // getID
    static async getById(req, res) {
        // BaseAPI.authorizationAPI(req, res, async () => {
        try {
            const payload = await Product.findOne({ _id: req.params.id })
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
        let listImage = []
        const result = await cloud.uploads(req.body.picture[0].thumbUrl)
        const temp = { imageUrl: result.url, imageId: result.id }
        listImage.push(temp)
        var post = new Product({
            productName: req.body.productName,
            description: req.body.description,
            quantity: req.body.quantity,
            price: req.body.price,
            discountPrice: req.body.discountPrice,
            guarantee: req.body.guarantee,
            category: req.body.category,
            status: req.body.status,
            image: listImage
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
        let temp = { ...req.body }
        let result = {}
        if (req.body.picture) {
            let listImage = []
            result = await cloud.uploads(req.body.picture[0].thumbUrl)
            temp = { imageUrl: result.url, imageId: result.id }
            listImage.push(temp)
            temp = { ...temp, image: listImage }
        }
        try {
            const { _id } = req.body
            await Product.findOneAndUpdate({ _id }, temp, { new: true }, (err, result) => {
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
            await Product.deleteOne({ _id: productID }, async (err, result) => {
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