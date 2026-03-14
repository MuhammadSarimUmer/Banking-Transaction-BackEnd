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

async function getUserAccount(req, res) {
    const user = req.user
    const account = await accountModel.find({
        userId: user._id
    })
    res.status(200).json({
        message: "Account fetched successfully",
        status: "success",
        account
    })
}

async function getAccountBalance(req, res) {
    const { accountId } = req.params

    const account = await accountModel.findOne({
        _id: accountId,
        userId: req.user._id
    })
    if (!account) {
        return res.status(400).json({ message: "Invalid account id or user does not have access to the account" })
    }

    const balance = await account.getBalance()
    res.status(200).json({
        message: "Account balance fetched successfully",
        status: "success",
        balance
    })
}

module.exports = { createAccount, getUserAccount, getAccountBalance }
