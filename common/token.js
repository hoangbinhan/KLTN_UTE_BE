const jwttoken = require('../common/function');

class BaseAPI {
    static verifyResult(output, init = []) {
        if (!output) {
            return init
        } else {
            return output
        }
    }

    static async authorizationAPI(req, res, runAction, isCheckSignature) {
        try {
            const tokenAuthen = req.get('Authorization').replace('Bearer ', '')
            if (jwttoken.verifyToken(tokenAuthen)) {
                const user = jwttoken.lowerCase(jwttoken.decodeToken(tokenAuthen))
                req.user = user
                runAction(user)
            } else {
                res.status(401).send('Authentication failed, please contact to Ush admin if you have any questions')
            }
        } catch (error) {
            res.status(500).send('error :' + error)
        }
    }
}

module.exports = BaseAPI