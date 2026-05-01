const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tourpackage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tourpackage',
        required: true
    },

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    numberOfPeople: {
        type: Number,
        required: true,
        min: 1
    },

    travelDate: {
        type: Date,
        required: true
    },

    totalAmount: {
        type: Number,
        default: 0
    },
bookingStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
},

    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Refunded'],
        default: 'Pending'
    },

    bookedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});


bookingSchema.pre('save', async function () {
    try {
        if (
            this.isModified('tourpackage') ||
            this.isModified('numberOfPeople')
        ) {
            const Tourpackage = mongoose.model('Tourpackage');

            const selectedPackage = await Tourpackage.findById(this.tourpackage);

            if (!selectedPackage) {
                throw new Error('Tour package not found');
            }

            this.totalAmount = selectedPackage.price * this.numberOfPeople;
        }
    } catch (error) {
        throw error;
    }
});

/*
|--------------------------------------------------------------------------
| Prevent Duplicate Booking
|--------------------------------------------------------------------------
| One user can book a package only once
|--------------------------------------------------------------------------
*/
bookingSchema.index(
    { tourpackage: 1, customer: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    'Booking',
    bookingSchema,
    'bookings'
);