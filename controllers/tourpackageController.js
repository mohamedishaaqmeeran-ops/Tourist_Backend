const Tourpackage = require('../models/tourpackage');
const Booking = require('../models/booking');

const getAllTourpackages = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, location, category, duration } = req.query;

        const query = { isActive: true };

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (category) {
            query.category = category;
        }

        if (duration) {
            query.duration = duration;
        }

        const tourpackages = await Tourpackage.find(query)
            .populate('consultancy', 'name')
            .populate('postedBy', 'name')
            .populate('postedBy', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Tourpackage.countDocuments(query);

        res.status(200).json({
            tourpackages,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            totalJobs: total
        });
    } catch (error) {
        res.status(500).json({ message: 'Fetching all Tour Packages failed', error: error.message });
    }
}

const getTourpackageById = async (req, res) => {
    try {
        const { id } = req.params;

        const tourpackage = await Tourpackage.findById(id)
            .populate('consultancy', 'name')
            .populate('postedBy', 'name');

        if (!tourpackage) {
            return res.status(404).json({ message: 'Tour Package not found' });
        }

        res.status(200).json({ tourpackage });
    } catch (error) {
        res.status(500).json({ message: 'Fetching tour package by ID failed', error: error.message });
    }
}

const createTourpackage = async (req, res) => {
    try {
        const { title, description, location, category, duration, price } = req.body;

        const newTourpackage = new Tourpackage({
            title,
            description,
            location,
            category,
            duration,
            price,
            consultancy: req.user.assignedConsultancy,
            postedBy: req.userId
        });

        const savedTourpackage = await newTourpackage.save();

        const populatedTourpackage = await Tourpackage.findById(savedTourpackage._id)
            .populate('consultancy', 'name')
            .populate('postedBy', 'name');

        res.status(201).json({ message: 'Tour Package created successfully', tourpackage: populatedTourpackage });
    } catch (error) {
        res.status(500).json({ message: 'Creating tour package failed', error: error.message });
    }
}

          

     

const updateTourpackage = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedTourpackage = await Tourpackage.findByIdAndUpdate(id, updates, { new: true })
            .populate('consultancy', 'name logo')
            .populate('postedBy', 'name');

        if (!updatedTourpackage) {
            return res.status(404).json({ message: 'Tour Package not found' });
        }

        res.status(200).json({ message: 'Tour Package updated successfully', tourpackage: updatedTourpackage });
    } catch (error) {
        res.status(500).json({ message: 'Updating tour package failed', error: error.message });
    }
}

const deleteTourpackage = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTourpackage = await Tourpackage.findByIdAndDelete(id);

        if (!deletedTourpackage) {
            return res.status(404).json({ message: 'Tour Package not found' });
        }

        res.status(200).json({ message: 'Tour Package deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Deleting tour package failed', error: error.message });
    }
}

const getConsultantsTourpackages = async (req, res) => {
    try {
        const tourpackages = await Tourpackage.find({ postedBy: req.userId })
            .populate('consultancy', 'name logo')
            .sort({ createdAt: -1 });

        res.status(200).json({ tourpackages });
    } catch (error) {
        res.status(500).json({ message: 'Fetching consultant tour packages failed', error: error.message });
    }
}

const getTourpackageBookings = async (req, res) => {
    try {
        const { id } = req.params;

        // verify that the tour package belongs to the consultant
        const tourpackage = await Tourpackage.findOne({ _id: id, postedBy: req.userId })

        if (!tourpackage) {
            return res.status(404).json({ message: 'Tour Package not found or you do not have permission to view bookings for this tour package' });
        }

        const bookings = await Booking.find({ tourpackage: id })
            .populate('customer', 'name email phone profilePicture location')
            .populate('tourpackage', 'title')
            .sort({ bookedAt: -1 });

        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ message: 'Fetching tour package bookings failed', error: error.message });
    }
}

module.exports = {
    getAllTourpackages,
    getTourpackageById,
    createTourpackage,
    updateTourpackage,
    deleteTourpackage,
    getConsultantsTourpackages,
    getTourpackageBookings

}