const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch notifications specific to the user OR global ones
        const notifications = await Notification.find({
            $or: [
                { recipient: userId },
                { recipient: null }
            ]
        }).sort({ createdAt: -1 }).limit(50);

        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving notifications' });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        res.json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification status' });
    }
};

module.exports = { getNotifications, markAsRead };
