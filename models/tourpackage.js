const mongoose = require('mongoose');

const tourpackageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    
    location: { type: String, required: true },
    category: {
        type: String,
        enum: ['Domestic', 'International'],
        default: 'Domestic',
    },
      price: {
        type: Number,
        required: true
    },

    duration: {
        type: String,
        required: true
    },
     image: {   
        type: String,
        default: ''
    },
    
    consultancy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consultancy',
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
   
    isActive: { type: Boolean, default: true },
    bookingCount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Tourpackage', tourpackageSchema, 'tourpackages');