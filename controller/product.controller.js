const Product = require('../models/products.model');
const Categories = require('../models/categories.model')
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
            const {query} = await req
            const page = await query.page ? parseInt(query.page) - 1 : 0
            const size = await query.size ? parseInt(query.size) : 10
            let condition = await {
                productName: query.text ?  {$regex: query.text, $options: 'i'} : undefined,
                category: query.category ? {$in: query.category} : undefined,
                status: query.status,
            }
            const sortValue = query.sort ? parseInt(query.sort) : undefined
            await Object.keys(condition).forEach(key => condition[key] === undefined ? delete condition[key] : {});
            const payload = await Product.find(condition).skip(size * page).limit(size).sort({price:sortValue})
            const total = await Product.countDocuments(condition)
            res.status(200).json({
                status: 'success',  
                total: total,
                size: size ,
                page: page,
                data: payload
            });
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

    // post
    static async create(req, res) {
        const { category, description, discountPrice, price, guarantee, images, productName, quantity, status } = req.body
        let listImage = []
        try {
            if (images) {
                for (let i = 0; i < images.length; i++) {
                    try {
                        const result = await cloud.uploads(images[i])
                        const temp = {uid: result.id, url: result.url}
                        listImage.push(temp)
                    } catch (err) {
                        res.status(400).json({ err: `some problem in upload image // ${err}` })
                    }
                }
            }
            var post = new Product({
                productName: productName,
                description: description,
                quantity: quantity,
                price: price,
                discountPrice: discountPrice,
                guarantee: guarantee,
                category: category,
                status: status,
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
        } catch (err) {
            res.status(400).json({
                status: 'fail',
                message: err
            });
        }
    }
    //Edit
    static async update(req, res) {
        var { _id, category, description, discountPrice, price, guarantee, picture, images, productName, quantity, status } = req.body
        let listImage = []
        try {
            if (picture) {
                listImage = await [...picture].filter((item)=>item.url)
                if(images){
                    for (let i = 0; i < images.length; i++) {
                            try {
                                const result = await cloud.uploads(req.body.images[i])
                                const temp = {uid: result.id, url: result.url}
                                listImage.push(temp)
                            } catch (err) {
                                res.status(400).json({ err: `some problem in upload image // ${err}` })
                            }
                        }
                    }
                }
            try {
                var post = {
                    productName: productName,
                    description: description,
                    quantity: quantity,
                    price: price,
                    discountPrice: discountPrice,
                    guarantee: guarantee,
                    category: category,
                    status: status,
                    image: listImage
                }
                if(!picture){
                    await delete post.image
                }
                await Product.findOneAndUpdate({ _id }, post, { new: true }, (err, result) => {
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
        } catch (err) {
            res.status(400).json({ message: err })
        }
    }
    //Delete
    static async delete(req, res) {
        const { productID } = req.body
        try {
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
    }
}
module.exports = ProductServices