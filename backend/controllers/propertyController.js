const Property = require('../models/Property');

const getProperties = async (req, res) => {
    try {
        const properties = await Property.find().populate('owner', 'name email phone role profileImage experience about phoneNumber socialLinks');
        res.json({ properties });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProperty = async (req, res) => {
    try {
        const property = await Property.create(req.body);
        res.status(201).json({ message: 'Property added', property });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedProperty = await Property.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedProperty) return res.status(404).json({ message: 'Property not found' });
        res.json({ message: `Property status updated to ${status}`, property: updatedProperty });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProperty = await Property.findByIdAndDelete(id);
        if (!deletedProperty) return res.status(404).json({ message: 'Property not found' });
        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProperties, createProperty, updateProperty, deleteProperty };
