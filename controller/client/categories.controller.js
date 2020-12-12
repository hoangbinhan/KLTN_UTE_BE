const Categories = require('../../models/categories.model');

async function getCategories(req, res) {
    try {
        const payload = await Categories.find({status:'ACTIVE'}).sort({sortOrder: 1})
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

module.exports = getCategories

