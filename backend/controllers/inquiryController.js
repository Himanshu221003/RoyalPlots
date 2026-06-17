const Inquiry = require('../models/Inquiry');

const getInquiries = async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json({ inquiries });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createInquiry = async (req, res) => {
    try {
        const inquiry = await Inquiry.create(req.body);
        res.status(201).json({ message: 'Inquiry submitted', inquiry });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateInquiry = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedInquiry = await Inquiry.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedInquiry) return res.status(404).json({ message: 'Inquiry not found' });
        res.json({ message: `Inquiry status updated to ${status}`, inquiry: updatedInquiry });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getInquiries, createInquiry, updateInquiry };
