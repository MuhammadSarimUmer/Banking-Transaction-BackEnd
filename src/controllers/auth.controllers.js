const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const emailService = require('../services/email.service')


async function userRegister(req, res) {

    const { email, username, password } = req.body

    const isExist = await userModel.findOne({ email })
    if (isExist) {
        return res.status(422).json({ message: 'Email already exist', status: "failed" })
    }

    const user = await userModel.create({ email, username, password })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' })

    res.cookie('token', token,
        //  { httpOnly: true }
    )

    res.status(201).json({
        message: 'User created successfully',
        status: "success",
        user: {
            id: user._id,
            name: user.username,
            email: user.email
        },
        token

    })

    await emailService.sendRegistrationEmail(user.email, user.username)






}

async function userLogin(req, res) {
    const { email, password, username } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(404).json({ message: 'User not found', status: 'failed' })
    }
    if (!user.comparePassword(password)) {
        return res.status(401).json({ message: 'Invalid Credentials', status: 'failed' })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3d' })
    res.cookie('token', token, { httpOnly: true })
    res.status(200).json({
        message: 'Login Successful', status: 'success',
        user: {
            id: user._id,
            name: user.username,
            email: user.email
        },
        token
    })



}


module.exports = { userRegister, userLogin }