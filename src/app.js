const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimitMiddleware = require('./middlewares/rateLimit.middleware');

const authRoutes = require('./routes/auth.routes');
const accountRoutes = require('./routes/account.routes');
const transactionRoutes = require('./routes/transaction.routes');

const app = express();

app.use(helmet());
app.use(morgan('dev'));


app.use(cors({

    origin: process.env.CLIENT_URL || 'http://localhost:3000',

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cookieParser());

app.use('/api', rateLimitMiddleware.generalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/transaction', transactionRoutes);

app.use((err, req, res, next) => {
    console.error(`[Error]: ${err.message}`);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",

        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

module.exports = app;