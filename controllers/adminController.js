const Consultancy = require('../models/consultancy');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const createConsultancy = async (req, res) => {
    try {
       
        const { name, description, website,  location,  foundedYear } = req.body;

        const newConsultancy = new Consultancy({
            name,
            description,
            website,
           
            location,
          
            foundedYear,
            createdBy: req.userId
        });

   
        const existingConsultancy = await Consultancy.findOne({ name });

        if (existingConsultancy) {
            return res.status(400).json({ message: 'Consultancy already exists' });
        }

        const savedConsultancy = await newConsultancy.save();

        if (savedConsultancy) {
            res.status(201).json({ message: 'Consultancy created successfully', consultancy: savedConsultancy });
        } else {
            res.status(400).json({ message: 'Failed to create consultancy' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to create consultancy', error: error.message });
    }
}

const getAllConsultancies = async (req, res) => {
    try {
        const consultancies = await Consultancy.find().populate('createdBy', 'name email');

        res.status(200).json({ consultancies });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve consultancies', error: error.message });
    }
}

const updateConsultancy = async (req, res) => {
    try {
        const { id } = req.params;

        const updates = req.body;

        const updatedConsultancy = await Consultancy.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedConsultancy) {
            return res.status(404).json({ message: 'Consultancy not found' });
        }

        res.status(200).json({ message: 'Consultancy updated successfully', consultancy: updatedConsultancy });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update consultancy', error: error.message });
    }
}

const deleteConsultancy = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedConsultancy = await Consultancy.findByIdAndDelete(id);

        if (!deletedConsultancy) {
            return res.status(404).json({ message: 'Consultancy not found' });
        }

        res.status(200).json({ message: 'Consultancy deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete consultancy', error: error.message });
    }
}

const createConsultant = async (req, res) => {
    try {

        const { name, email, password, consultancyId } = req.body;

        
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

    
        const consultancy = await Consultancy.findById(consultancyId);

        if (!consultancy) {
            return res.status(404).json({ message: 'Consultancy not found' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newConsultant = new User({
            name,
            email,
            password: hashedPassword,
            role: 'consultant',
            assignedConsultancy: consultancyId
        });

        const savedConsultant = await newConsultant.save();

        if (savedConsultant) {
            res.status(201).json({ message: 'Consultant created successfully', consultant: savedConsultant });
        } else {
            res.status(400).json({ message: 'Failed to create consultant' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to create consultant', error: error.message });
    }
}

const getAllConsultants = async (req, res) => {
    try {

        const consultants = await User.find({ role: 'consultant' }).populate('assignedConsultancy', 'name');

        res.status(200).json({ consultants });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve consultants', error: error.message });
    }
}

module.exports = {
    createConsultancy,
    getAllConsultancies,
    updateConsultancy,
    deleteConsultancy,
    createConsultant,
    getAllConsultants
}