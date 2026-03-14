const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')
const accountModel = require('../models/account.model')
const emailService = require('../services/email.service')
const mongoose = require('mongoose')

async function createTransaction(req, res) {

    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "Missing required fields" })
    }

    const fromAccountInfo = await accountModel.findOne({
        _id: fromAccoun``
    })

    const toAccountInfo = await accountModel.findOne({
        _id: toAccount
    })

    if (!fromAccountInfo || !toAccountInfo) {
        return res.status(400).json({ message: "Invalid account id" })
    }

    const isTransactionAlreadyExists = await transactionModel.findOne({
        idempotencyKey
    })

    if (isTransactionAlreadyExists.status === "COMPLETED") {
        return res.status(200).json({
            message: "Transaction already completed",
            transaction: isTransactionAlreadyExists
        })

    }
    if (isTransactionAlreadyExists.status === "PENDING") {
        return res.status(200).json({
            message: "Transaction already processing",
            transaction: isTransactionAlreadyExists
        })
    }

    if (isTransactionAlreadyExists.status === "FAILED") {
        return res.status(400).json({
            message: "Transaction processing failed",
            transaction: isTransactionAlreadyExists
        })
    }

    if (isTransactionAlreadyExists.status === "REVERSED") {
        return res.status(400).json({
            message: "Transaction reversed",
            transaction: isTransactionAlreadyExists
        })
    }

    if (toAccountInfo.status !== "Active" || fromAccountInfo.status !== "Active") {
        return res.status(400).json({ message: "Transaction failed due to one of the accounts not being active" })

    }
    const balance = await fromAccountInfo.getBalance()
    if (balance < amount) {
        return res.status(400).json({ message: `Insufficient balance, current balance is ${balance}, requested amount is ${amount}` })
    }
    let transaction;
    try {
        const session = mongoose.startSession()
        session.startTransaction()
        transaction = (await transactionModel.create([{
            fromAccount: fromAccount._id,
            toAccount: toAccount._id,
            amount,
            idempotencyKey,
            status: "PENDING"
        }, { session }]))[0]

        const debitLedgerEntry = await ledgerModel.create([{
            account: fromAccount,
            amount: amount,
            type: "DEBIT",
            transcation: transaction._id

        }, { session }])

        // await (() => {
        //     return new Promise((resolve) => {
        //         setTimeout(resolve, 100 * 1000)
        //     })
        // })()
        const creditLedgerEntry = await ledgerModel.create([{
            account: toAccount,
            amount: amount,
            type: "CREDIT",
            transcation: transaction._id

        }, { session }])

        await transactionModel.findOneAndUpdate({ _id: transaction._id }, { status: "COMPLETED" }, { session })
        await session.commitTransaction()
        await emailService.sendTransactionEmail(req.user.email, req.user.username, amount, toAccount._id)
        res.status(201).json({
            message: "Transaction created successfully",
            transaction
        })
        session.endSession()
    }
    catch (err) {
        return res.status(400).json({ message: "Transaction failed due to pending/failed due to some issue, please retry after some time" })
    }
}

async function createInitialFunds(req, res) {
    const { toAccount, amount, idempotencyKey } = req.body
    if (!toAccount || !amount || !idempotencyKey) {
        return res.status(400).json({ message: "Missing required fields" })
    }
    const toAccountInfo = await accountModel.findOne({
        _id: toAccount
    })

    if (!toAccountInfo) {
        return res.status(400).json({ message: "Invalid account id" })
    }

    const fromAccountInfo = await accountModel.findOne({
        userId: req.user._id
    })
    if (!fromAccountInfo) {
        return res.status(400).json({ message: "Invalid account id" })
    }
    const session = mongoose.startSession()
    session.startTransaction()
    const transaction = new transactionModel({
        fromAccount: fromAccount._id,
        toAccount,
        amount,
        idempotencyKey,
        status: "PENDING"
    })

    const debitLedgerEntry = await ledgerModel.create([{
        account: fromAccount._id,
        amount: amount,
        type: "DEBIT",
        transcation: transaction._id

    }, { session }])
    const creditLedgerEntry = await ledgerModel.create([{
        account: toAccount._id,
        amount: amount,
        type: "CREDIT",
        transcation: transaction._id

    }, { session }])

    transaction.status = "COMPLETED"
    await transaction.save({ session })
    await session.commitTransaction()
    //   await emailService.sendTransactionEmail(req.user.email, req.user.username, amount, toAccount._id)
    res.status(201).json({
        message: "Transaction created successfully",
        transaction
    })
}

module.exports = { createTransaction, createInitialFunds }