const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')
const accountModel = require('../models/account.model')
const emailService = require('../services/email.service')

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
}