const express = require('express')
const authController = require('../controllers/auth.controllers')
const router = express.Router()
const validationMiddleware = require('../middlewares/validation.middleware')
const rateLimitMiddleware = require('../middlewares/rateLimit.middleware')

router.post('/register', rateLimitMiddleware.authLimiter, validationMiddleware.registerValidation, authController.userRegister)
router.post('/login', rateLimitMiddleware.authLimiter, authController.userLogin)
router.post('/logout', authController.userLogout)

module.exports = router