const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User is always required"],
        index: true
    },

    status: {
        type: String,
        enum: {
            values: ["ACTIVE", "FROZEN", "CLOSED"],
            message: "Status must be ACTIVE, FROZEN or CLOSED",

        },
        default: "ACTIVE"
    },
    currency: {
        type: String,
        required: [true, "Currency is required"],
        default: "USD"

    }
}, {
    timestamps: true
})

accountSchema.index({ userId: 1, status: 1 });

const accountModel = mongoose.model('account', accountSchema)

module.exports = accountModel
