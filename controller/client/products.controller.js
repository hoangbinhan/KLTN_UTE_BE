const Product = require('../models/products.model');

async function getProduct(req,res){
    try {
        const {query} = await req
        const page = await query.page ? parseInt(query.page) - 1 : 0
        const size = await query.size ? parseInt(query.size) : 10
        let condition = await {
            productName: query.text ?  {$regex: query.text, $options: 'i'} : undefined,
            category: query.category ? {$in: query.category} : undefined,
            status: 'ACTIVE',
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