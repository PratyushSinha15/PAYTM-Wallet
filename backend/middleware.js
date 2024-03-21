//creating headers for an authorization header (Bearer Token)
//verifies weather the token is valid or not 
// puts the userId in the request object if token checks out
// if not, return 403 status bacl to user

const { JWT_SECRET } = require('./config');
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const authHeader= req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(403).json({
            message: "Unauthorized"
        });
    }
    //format of bearer token is Bearer token
    const token= authHeader.split(' ')[1];//splitting the token from the header because the token is in the format of Bearer token so we are splitting the token from the header
    try{
        const decoded=jwt.verify(token, JWT_SECRET);
        req.userId= decoded.userId;
        next();
    }catch(err){
        return res.status(403).json({
            message: "Unauthorized"
        });
    }
};

module.exports = {
    authMiddleware
};