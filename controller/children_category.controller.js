const Post = require('../models/children_category.model')
const Parent = require('../models/categories.model')
const service = require('../common/function')
const { times, isBuffer } = require('lodash')

class APIfeatures {
    constructor(query, queryString){
        this.query = query
        this.queryString = queryString
    }
}

class ChildrebServices {
    static async addNew(req,res){
        console.log('req.body', req.body)
        let post = new Post({
            childrenCategoryName : req.body.childrenCategoryName,
            link: req.body.link,
            sortOrder : req.body.sortOrder,
            status: req.body.status
        })

        try{ 
            const savePost = await post.save()
            Parent.findOneAndUpdate({_id: req.body.categoryId}, {$push: {children: post._id}}, (err)=>{})
            res.status(200).json({
                status: 'success',
                result: savePost.length,
                data: {
                    savePost,
                }
            })
        }catch(err){
            res.status(400).json({
                status: 'fail',
                message: err
            })
        }
    }
}

module.exports = ChildrebServices