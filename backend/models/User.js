const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    profileImage: { type: String, default: '' },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    role: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
    experience: { type: Number, default: 0 },
    about: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    socialLinks: {
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        instagram: { type: String, default: '' }
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
    viewedProperties: [{
        property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
        viewedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
