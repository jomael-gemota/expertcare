const key = require('ckey');
const { verify } = require('jsonwebtoken');

module.exports = {
    checkToken: (req, res, next) => {
        let token = req.get('authorization');

        if(token) {
            token = token.slice(7);
            verify(token, key.JSTOKEN_SECRET_KEY, (err, decoded) => {
                if(err) {
                    res.json({
                        success: 0,
                        message: "You have an invalid token."
                    });
                } else {
                    next();
                }
            })
        } else {
            res.json({
                success: 0,
                message: "You have no access."
            });
        }
    }
};