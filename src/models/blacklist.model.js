const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"],
        unique: true,

    },

}, {
    timestamps: true
})

tokenSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 60 * 60 * 24 * 3
})

const tokenBlacklistModel = mongoose.model('tokenBlacklist', tokenSchema)

module.exports = tokenBlacklistModel