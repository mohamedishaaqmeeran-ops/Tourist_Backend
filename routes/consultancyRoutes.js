const express = require('express');
const { createConsultancy, getAllConsultancies, updateConsultancy, deleteConsultancy, createConsultant, getAllConsultants } = require('../controllers/adminController');

const { isAuthenticated, allowRoles } = require('../middlewares/auth');

const consultancyRouter = express.Router();

// all routes in this router are protected and only accessible by admin users
consultancyRouter.use(isAuthenticated);
consultancyRouter.use(allowRoles(['admin']));

consultancyRouter.post('/', createConsultancy);
consultancyRouter.get('/', getAllConsultancies);
consultancyRouter.put('/:id', updateConsultancy);
consultancyRouter.delete('/:id', deleteConsultancy);

consultancyRouter.post('/consultants', createConsultant);
consultancyRouter.get('/consultants', getAllConsultants);

module.exports = consultancyRouter;