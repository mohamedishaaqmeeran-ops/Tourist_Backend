const express = require('express');
const { getAllTourpackages, getTourpackageById, createTourpackage, updateTourpackage, deleteTourpackage, getConsultantsTourpackages, getTourpackageBookings } = require('../controllers/tourpackageController');
const { isAuthenticated, allowRoles } = require('../middlewares/auth');

const tourpackageRouter = express.Router();

// public routes
tourpackageRouter.get('/', getAllTourpackages);
tourpackageRouter.get('/:id', getTourpackageById);

// protected routes
tourpackageRouter.post('/', isAuthenticated, allowRoles(['consultant']), createTourpackage);
tourpackageRouter.put('/:id', isAuthenticated, allowRoles(['consultant']), updateTourpackage);
tourpackageRouter.delete('/:id', isAuthenticated, allowRoles(['consultant']), deleteTourpackage);
tourpackageRouter.get('/consultant/tourpackages', isAuthenticated, allowRoles(['consultant']), getConsultantsTourpackages);
tourpackageRouter.get('/consultant/tourpackages/:id/bookings', isAuthenticated, allowRoles(['consultant']), getTourpackageBookings);

module.exports = tourpackageRouter;