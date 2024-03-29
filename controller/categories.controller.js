const Post = require('../models/categories.model');
const STATUS_TYPE = require('../common/constants').statusActive
const service = require('../common/function');
const cloud = require('../common/cloudinaryConfig');
const fs = require('fs');
const _isEmpty = require('lodash').isEmpty

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
        //  ?title= ; ?price[lte]= ;
    }
    sorting() {
        if (this.queryString.sort) {
            const sortby = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortby);
        } else {
            this.query = this.query.sort('-createAt');
        }
        return this;
        // ?sort=-price
    }
    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 4;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
        // ?page=1&limit=5
    }
}
class CategoriesServices {
    //Search
    static async search(req, res) {
        var regex = new RegExp(req.params.productName, 'i');
        Post.find({ productName: regex }).then((result) => {
            res.status(200).json(result);
        })
    }
    //GetALL
    static async get(req, res) {
        try {
            const {query} = await req
            let condition = await {
                categoryName: query.text ?  {$regex: query.text, $options: 'i'} : undefined,
                status: query.status,
            }
            await Object.keys(condition).forEach(key => condition[key] === undefined ? delete condition[key] : {});
            const payload = await Post.find(condition)
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
    }
    // getID
    static async getById(req, res) {

        try {
            const payload = await Post.findOne({ categoryID: req.params.id })
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
    }

    // Multer IMG
    static async uploadIMG(req, res) {
        let result = {
            id: '',
            url: ''
        }
        if(req.body.upload.length > 0){
             result = await cloud.uploads(req.body.upload[0].thumbUrl)
        }
        var post = new Post({
            categoryName: req.body.categoryName,
            image: {...req.body.upload[0]},
            link: req.body.link,
            sortOrder: req.body.sortOrder,
            status: req.body.status,
            imageUrl: result.url,
            imageId: result.id
        });
        try {
            const savePost = await post.save();
            res.status(200).json({
                status: 'success',
                result: savePost.length,
                data: {
                    savePost
                }
            });
        } catch (err) {
            res.status(400).json({
                status: 'fail',
                message: err
            });
        }
    }

    static async editImage(productID, file){
        const resultImage = {}
        const oldPost = await Post.findOne({ categoryID })
        if(_isEmpty(oldPost)){
            return res.json(false)
        }
        //delete thằng cũ 
        // await cloud.delete(oldPost.publishIdImage || 0)
        //upload mới rồi return 
        return !_isEmpty(await cloud.upload(file)) ? resultImage : {}
    }

    //Edit
    static async update(req, res) {
        let temp = {...req.body}
        let result = {}
        if(req.body.upload){
            result = await cloud.uploads(req.body.upload[0].thumbUrl)
            temp = {...temp, image: temp.upload[0],  imageUrl: result.url, imageId: result.id}
        }
        
        try {
            const {_id} = temp
            await Post.findOneAndUpdate({ _id }, temp, { new: true }, (err, result) => {
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
    }
    //Delete
    static async delete(req, res) {
        try {
            const { categoryID } = req.body
            await Post.deleteOne({ _id: categoryID }, async (err, result) => {
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
module.exports = CategoriesServices