const jwt = require('jsonwebtoken')
const key = 'BigBangTheory';


const authenticateToken = (req, res, next) => {
    const header = req.headers.authorization;

    if( header ){
        const token = header.split(' ')[1];
        jwt.verify(token, key, (error, decoded) => {
            if( error ){
                res
                    .status(403)
                    .send('Error - forbidden')
            } else {
                req.user = decoded.user;
                next();
            }
        })
    } else {
        res
            .status(401)
            .send('Unauthorized')
    }
};


const checkAdmin = (req, res, next) => {
    if( req.user && req.user.role === 'admin'){
        next()
    } else {
        res
            .status(403)
            .send('Forbidden')
    }
};

module.exports = { authenticateToken, checkAdmin };