const express = require('express')
const router = express.Router()
const accountController = require('../controllers/account.controllers')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/create-account', authMiddleware.authMiddleware, accountController.createAccount)

router.get('/get-account', authMiddleware.authMiddleware, accountController.getUserAccount)

router.get('/get-balance/:accountId', authMiddleware.authMiddleware, accountController.getAccountBalance)


module.exports = router