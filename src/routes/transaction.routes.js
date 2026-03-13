const express = require('express')
const transactionController = require('../controllers/transaction.controller')
const authMiddleware = require('../middlewares/auth.middleware')

const router = express.Router()


router.post('/create-transaction', authMiddleware.authMiddleware, transactionController.createTransaction);
router.post('/create-initial-funds', authMiddleware.authSystemUserMiddleware, transactionController.createInitialFunds);




module.exports = router