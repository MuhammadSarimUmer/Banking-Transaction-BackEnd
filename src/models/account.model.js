const mongoose = require('mongoose');
const ledgerModel = require('./ledger.model');

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
});

accountSchema.index({ userId: 1, status: 1 });

accountSchema.methods.getBalance = async function () {
    const balanceData = await ledgerModel.aggregate([

        { $match: { account: this._id } },


        {
            $group: {
                _id: null,
                totalDebit: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$type", "DEBIT"] },
                            then: "$amount",
                            else: 0
                        }
                    }
                },
                totalCredit: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$type", "CREDIT"] },
                            then: "$amount",
                            else: 0
                        }
                    }
                }
            }
        },


        {
            $project: {
                _id: 0,
                balance: {
                    $subtract: ["$totalCredit", "$totalDebit"]
                }
            }
        }
    ]);

    if (balanceData.length === 0) {
        return 0;
    }
    return balanceData[0].balance;
};

const accountModel = mongoose.model('account', accountSchema);

module.exports = accountModel;