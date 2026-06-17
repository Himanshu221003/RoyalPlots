const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: String, required: true },
    category: { type: String, enum: ['buy', 'rent'], default: 'buy' },
    description: { type: String },
    images: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    views: { type: Number, default: 0 },
    coordinates: {
        lat: { type: Number, default: 22.7196 },
        lng: { type: Number, default: 75.8577 }
    }
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);
