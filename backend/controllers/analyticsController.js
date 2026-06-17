const User = require('../models/User');
const Property = require('../models/Property');
const Inquiry = require('../models/Inquiry');

// @desc    Get dashboard analytics statistics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin or Agent)
const getDashboardStats = async (req, res) => {
    try {
        const userRole = req.user.role;

        if (userRole === 'admin') {
            // --- ADMIN STATS ---
            const totalUsers = await User.countDocuments();
            const totalProperties = await Property.countDocuments();
            const totalInquiries = await Inquiry.countDocuments();

            // Top 5 most viewed properties
            const topProperties = await Property.find({})
                .sort({ views: -1 })
                .limit(5)
                .populate('owner', 'name email');

            // Category breakdown (buy vs rent)
            const buyCount = await Property.countDocuments({ category: 'buy' });
            const rentCount = await Property.countDocuments({ category: 'rent' });

            // Mock trends for charts (so they render beautifully with realistic progression)
            const registrationTrend = [
                { month: 'Jan', users: Math.round(totalUsers * 0.4) },
                { month: 'Feb', users: Math.round(totalUsers * 0.5) },
                { month: 'Mar', users: Math.round(totalUsers * 0.7) },
                { month: 'Apr', users: Math.round(totalUsers * 0.8) },
                { month: 'May', users: Math.round(totalUsers * 0.9) },
                { month: 'Jun', users: totalUsers }
            ];

            const inquiryTrend = [
                { month: 'Jan', inquiries: Math.round(totalInquiries * 0.3) },
                { month: 'Feb', inquiries: Math.round(totalInquiries * 0.4) },
                { month: 'Mar', inquiries: Math.round(totalInquiries * 0.6) },
                { month: 'Apr', inquiries: Math.round(totalInquiries * 0.5) },
                { month: 'May', inquiries: Math.round(totalInquiries * 0.8) },
                { month: 'Jun', inquiries: totalInquiries }
            ];

            return res.json({
                success: true,
                role: 'admin',
                stats: {
                    totalUsers,
                    totalProperties,
                    totalInquiries,
                    categoryBreakdown: { buy: buyCount, rent: rentCount }
                },
                topProperties,
                charts: {
                    registrationTrend,
                    inquiryTrend
                }
            });
        } else if (userRole === 'agent') {
            // --- AGENT STATS ---
            const agentId = req.user._id;

            // Total properties listed by this agent
            const properties = await Property.find({ owner: agentId });
            const propertyIds = properties.map(p => p._id);
            const totalProperties = properties.length;

            // Sum views of all properties owned by this agent
            const totalViews = properties.reduce((acc, p) => acc + (p.views || 0), 0);

            // Total inquiries on properties owned by this agent
            const totalInquiries = await Inquiry.countDocuments({ property: { $in: propertyIds } });

            // Top properties for this agent
            const topProperties = await Property.find({ owner: agentId })
                .sort({ views: -1 })
                .limit(5);

            // Category breakdown for this agent
            const buyCount = properties.filter(p => p.category === 'buy').length;
            const rentCount = properties.filter(p => p.category === 'rent').length;

            // Inquiries trend (simulated for agent's properties)
            const inquiryTrend = [
                { month: 'Jan', inquiries: Math.round(totalInquiries * 0.2) },
                { month: 'Feb', inquiries: Math.round(totalInquiries * 0.5) },
                { month: 'Mar', inquiries: Math.round(totalInquiries * 0.3) },
                { month: 'Apr', inquiries: Math.round(totalInquiries * 0.6) },
                { month: 'May', inquiries: Math.round(totalInquiries * 0.7) },
                { month: 'Jun', inquiries: totalInquiries }
            ];

            return res.json({
                success: true,
                role: 'agent',
                stats: {
                    totalProperties,
                    totalViews,
                    totalInquiries,
                    categoryBreakdown: { buy: buyCount, rent: rentCount }
                },
                topProperties,
                charts: {
                    inquiryTrend
                }
            });
        } else {
            return res.status(403).json({ message: 'Access denied. Only agents or admins can access analytics.' });
        }
    } catch (error) {
        console.error('Analytics Error:', error);
        res.status(500).json({ message: 'Error retrieving analytics data' });
    }
};

module.exports = { getDashboardStats };
