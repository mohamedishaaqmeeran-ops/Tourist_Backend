const express = require('express');
const authRouter = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const errorRoute = require('./middlewares/errorRoute');
const logger = require('./middlewares/logger');
const consultancyRouter = require('./routes/consultancyRoutes');
const tourpackageRouter = require('./routes/tourpackageRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const cors = require('cors');
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// middleware to parse the body of incoming requests as JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// middleware to parse cookies
app.use(cookieParser());

// custom logger middleware
app.use(logger);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/consultancies', consultancyRouter);
app.use('/api/v1/tourpackages', tourpackageRouter);
app.use('/api/v1/bookings', bookingRouter);
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Tourism API is running successfully 🚀'
    });
});
// middleware to handle undefined routes
app.use(errorRoute);

module.exports = app;