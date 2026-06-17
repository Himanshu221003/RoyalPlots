const Property = require('../models/Property');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { clearCache } = require('../config/redis');

// Helper to optimize Cloudinary image URLs
const optimizeCloudinaryUrl = (url) => {
    if (!url || typeof url !== 'string') return url;
    if (url.includes('res.cloudinary.com')) {
        return url.replace('/upload/', '/upload/q_auto,f_auto,w_1000/');
    }
    return url;
};

// Process properties to optimize all images
const optimizePropertyImages = (property) => {
    if (!property) return property;
    const p = property.toObject ? property.toObject() : property;
    if (p.images && p.images.length > 0) {
        p.images = p.images.map(img => optimizeCloudinaryUrl(img));
    }
    return p;
};

const getProperties = async (req, res) => {
    try {
        const properties = await Property.find().populate('owner', 'name email phone role profileImage experience about phoneNumber socialLinks');
        const optimized = properties.map(p => optimizePropertyImages(p));
        res.json({ properties: optimized });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Increment views count
        const property = await Property.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('owner', 'name email phone role profileImage experience about phoneNumber socialLinks');

        if (!property) return res.status(404).json({ message: 'Property not found' });

        // 2. Optional behavior logging for AI Recommendation Engine
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer')) {
            try {
                const token = authHeader.split(' ')[1];
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'royalplots-super-secret-key-12345');
                const user = await User.findById(decoded.id);
                if (user) {
                    // Check if last viewed is same to prevent spam logs
                    const lastViewed = user.viewedProperties[user.viewedProperties.length - 1];
                    if (!lastViewed || lastViewed.property.toString() !== id) {
                        user.viewedProperties.push({ property: id, viewedAt: new Date() });
                        if (user.viewedProperties.length > 50) {
                            user.viewedProperties.shift();
                        }
                        await user.save();
                    }
                }
            } catch (err) {
                console.log('Optional view tracking authentication skipped:', err.message);
            }
        }

        res.json({ success: true, property: optimizePropertyImages(property) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProperty = async (req, res) => {
    try {
        const property = await Property.create(req.body);
        
        // Clear Redis cache
        await clearCache('cache:*');

        // Emit socket notification to all clients about a new property listing
        if (req.io) {
            req.io.emit('new_property', {
                title: 'New Property Listed!',
                message: `${property.title} in ${property.location} is now available.`,
                propertyId: property._id
            });
        }

        res.status(201).json({ message: 'Property added', property });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const oldProperty = await Property.findById(id);
        if (!oldProperty) return res.status(404).json({ message: 'Property not found' });

        const updatedProperty = await Property.findByIdAndUpdate(id, req.body, { new: true });
        
        // Clear Redis cache
        await clearCache('cache:*');

        // Emit real-time price drop notification if price decreased
        if (req.io && req.body.price && req.body.price < oldProperty.price) {
            // Find all users who favorited this property to notify them
            const interestedUsers = await User.find({ favorites: id });
            
            interestedUsers.forEach(user => {
                req.io.to(user._id.toString()).emit('price_drop', {
                    title: 'Price Drop Alert!',
                    message: `Price for "${oldProperty.title}" has dropped from ₹${oldProperty.price.toLocaleString()} to ₹${req.body.price.toLocaleString()}!`,
                    propertyId: id
                });
            });
        }

        res.json({ message: `Property updated successfully`, property: updatedProperty });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProperty = await Property.findByIdAndDelete(id);
        if (!deletedProperty) return res.status(404).json({ message: 'Property not found' });

        // Clear Redis cache
        await clearCache('cache:*');

        res.json({ message: 'Property deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty };
