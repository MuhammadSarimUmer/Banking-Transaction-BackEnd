const express = require('express')

const router = express.Router()


router.post('/create-transaction', authMiddleware, transactionController.createTransaction)




module.exports = router