const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    propertyName: { type: String, required: true },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    message: { type: String },
    price: { type: String },
    status: { type: String, default: 'Sent' }
}, { timestamps: true });

module.exports = mongoose.model('Inquiry', InquirySchema);
