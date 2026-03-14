const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const tokenBlacklistModel = require('../models/blacklist.model');


async function authMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })
    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({
            message: "Invalid token"
        });
    }
}
async function authSystemUserMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })
    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select('+systemUser');

        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }


        if (!user.systemUser) {
            return res.status(403).json({
                message: "Forbidden: System User privileges required"
            });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}
module.exports = { authMiddleware, authSystemUserMiddleware };