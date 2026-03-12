const mongoose = require('mongoose')

async function connectDB() {
    await mongoose.connect(process.env.DB_URI)
        .then(() => console.log('DB connected'))
        .catch(err => {
            console.log(err),
            process.exit(1)
        })

}

module.exports = connectDB