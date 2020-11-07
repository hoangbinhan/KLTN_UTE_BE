const Post = require('../models/children_category.model')
const service = require('../common/function')
const { times } = require('lodash')

class APIfeatures {
    constructor(query, queryString){
        this.query = query
        this.queryString = queryString
    }
}

class TestServices {
    static async addNew(req,res){
        let post = new Post({
            childrenCategoryName : req.body.childrenCategoryName,
            link: req.body.link,
            sortOrder : req.body.sortOrder,
            status: req.body.status
        })
        try{
            const savePost = await post.save()
            res.status(200).json({
                status: 'success',
                result: savePost.length,
                data: {
                    savePost
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

module.exports = {TestServices}