const jwt = require('jsonwebtoken')


const auth = async (req, res, next) => {
    try {
        const token = await req.header("Authorization").replace('Bearer','').trim()
        if(!token) return res.status(400).json({msg: "Invalid Authentication."})
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, staff) => {
            if(err) return res.status(400).json({msg: "Invalid Authentication."})
            req.staff = staff
            next()
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = auth