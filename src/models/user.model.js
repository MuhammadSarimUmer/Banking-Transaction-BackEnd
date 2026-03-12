const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Name is required']

    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
        trim: true,

    }
}, {
    timestamps: true
})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return
    }
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash
    return


})

userSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(password, this.password)


}

const userModel = mongoose.model('user', userSchema)
module.exports = userModel