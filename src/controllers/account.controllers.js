const accountModel = require('../models/account.model');


async function createAccount(req, res) {
    const user = req.user
    const account = await accountModel.create({
        userId: user._id,
    })

    res.status(201).json({
        message: "Account created successfully",
        status: "success",
        account
    })
}

module.exports = { createAccount }
