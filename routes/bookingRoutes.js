const express = require('express');
const { isAuthenticated, allowRoles } = require('../middlewares/auth');
const { bookingForTourpackage,
    getUserBookings,
    updateBookingStatus,
    getBookingById } = require('../controllers/bookingController');

const bookingRouter = express.Router();

bookingRouter.use(isAuthenticated);

// user routes
bookingRouter.post('/:tourpackageId/book', allowRoles(['user']), bookingForTourpackage);
bookingRouter.get('/', allowRoles(['user']), getUserBookings);

// recruiter routes
bookingRouter.put('/:bookingId/status', allowRoles(['consultant']), updateBookingStatus);

// shared routes -- user and recruiter
bookingRouter.get('/:bookingId', allowRoles(['user', 'consultant']), getBookingById);

module.exports = bookingRouter;