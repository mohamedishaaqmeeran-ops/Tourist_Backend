const mongoose = require('mongoose');

const consultancySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    website: { type: String },
    logo: { type: String, default: '' },
   location: { type: String },
   
    foundedYear: { type: Number },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

module.exports = mongoose.model('Consultancy', consultancySchema, 'consultancies');