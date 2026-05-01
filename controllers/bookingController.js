const Tourpackage = require('../models/tourpackage');
const Booking = require('../models/booking');
// const sendMail = require('../utils/email');

const bookingForTourpackage = async (req, res) => {
    try {
         console.log("🔥 BOOKING HIT");
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);
    console.log("USER:", req.userId);
        const { numberOfPeople, travelDate } = req.body;
        const tourpackageId = req.params.tourpackageId;
        const userId = req.userId;

        // 🔥 FIX 1
        if (!tourpackageId || !userId) {
            return res.status(400).json({
                message: "Missing tourpackageId or userId"
            });
        }

        const tourpackage = await Tourpackage.findById(tourpackageId);

        if (!tourpackage || !tourpackage.isActive) {
            return res.status(404).json({
                message: 'Tour Package not found'
            });
        }

        const existingBooking = await Booking.findOne({
            tourpackage: tourpackageId,
            customer: userId
        });

        if (existingBooking) {
            return res.status(400).json({
                message: 'Already booked'
            });
        }

        const newBooking = new Booking({
            tourpackage: tourpackageId,
            customer: userId,
            numberOfPeople,
            travelDate
        });

        await newBooking.save();

        await Tourpackage.findByIdAndUpdate(
            tourpackageId,
            { $inc: { bookingCount: 1 } }
        );

        res.status(201).json({
            message: 'Booking successful',
            booking: newBooking
        });

    } catch (error) {
    console.error("🔥 BOOKING ERROR STACK:", error);
    return res.status(500).json({
        message: 'Booking failed',
        error: error.message
    });
}
};

const getUserBookings = async (req, res) => {
    try {
        const userId = req.userId;

        const bookings = await Booking.find({ customer: userId }).populate({
            path: 'tourpackage',
            populate: 'consultancy',
            select: 'title description location category duration price'
        })
            .sort({ bookedAt: -1 });

        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve bookings', error: error.message });
    }
}

const updateBookingStatus = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { status } = req.body;

        const userRole = req.user.role;

        if (userRole !== "consultant") {
            return res.status(403).json({
                message: "Only consultant can update status"
            });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const current = booking.bookingStatus;

        // 🚨 prevent invalid transitions
        const allowedTransitions = {
            Pending: ["Confirmed", "Cancelled"],
            Confirmed: ["Completed", "Cancelled"],
            Completed: []
        };

        if (!allowedTransitions[current].includes(status)) {
            return res.status(400).json({
                message: `Cannot change ${current} → ${status}`
            });
        }

        booking.bookingStatus = status;
        await booking.save();

        res.json({
            message: "Status updated",
            booking
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
              

        // send notification to applicant about status update
        // sendMail(application.applicant.email, 'Application Status Update', `Your application for the job "${application.job.title}" has been updated to: ${status}. Notes: ${notes}`);

 

const getBookingById = async (req, res) => {
    try {
        const { bookingId } = req.params;

        const user = req.user; // from middleware
        const role = user.role;

        const booking = await Booking.findById(bookingId)
            .populate({
                path: "tourpackage",
                populate: {
                    path: "consultancy",
                    select: "name logo"
                }
            })
            .populate("customer", "name email");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // 👤 USER → only own booking
        if (role === "user") {
            if (booking.customer._id.toString() !== user._id.toString()) {
                return res.status(403).json({
                    message: "Not your booking"
                });
            }
        }

        // 🧑‍💼 CONSULTANT → must belong to their consultancy
        if (role === "consultant") {
            const consultantId =
                booking.tourpackage.consultancy._id.toString();

            if (
                user.consultancyId &&
                consultantId !== user.consultancyId.toString()
            ) {
                return res.status(403).json({
                    message: "Not your consultancy booking"
                });
            }
        }

        // 👑 ADMIN (optional) → no restriction

        res.status(200).json({
            booking
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to retrieve booking details",
            error: error.message
        });
    }
};
module.exports = {
    bookingForTourpackage,
    getUserBookings,
    updateBookingStatus,
    getBookingById
}