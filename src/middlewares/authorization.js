// const cookie = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) return reject(err);
            else return resolve(user);
        })
    })
}

const authenticate = async(req, res, next) => {
    const cookieHeader = req.headers.authorization;
    if(!cookieHeader) return res.status(401).json({message: 'Missing cookie'});

    let token = cookieHeader.split(' ')[1];
    let user;

    try {
        user = await verifyToken(token);
    }
    catch (err){
        return res.status(500).json({ message: "Authorization token invalid" });
    }
    req.user = user.user;

    return next();
}

module.exports = { authenticate, verifyToken };