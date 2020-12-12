const Product = require('../../models/products.model');

async function getDetailProduct(req, res) {
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
}

module.exports = getDetailProduct