const app = require('./src/app');
require('dotenv').config();
const connectDB = require('./src/config/db');

const PORT = 3000;


async function start() {
    try {
        await connectDB();
        await app.listen(PORT);
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error(error);
    }
}

start();