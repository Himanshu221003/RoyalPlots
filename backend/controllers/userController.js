const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * GENERATE JWT TOKEN
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'royalplots-super-secret-key-12345', {
        expiresIn: '30d',
    });
};

/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const registerUser = async (req, res) => {
    try {
        const { name, email, password, gender } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            gender: gender || 'other',
            provider: 'local'
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                profileImage: user.profileImage,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Authenticate a user
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                profileImage: user.profileImage,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/update-profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.gender = req.body.gender || user.gender;
            
            if (req.body.profileImage !== undefined) {
                user.profileImage = req.body.profileImage;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                user: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    gender: updatedUser.gender,
                    profileImage: updatedUser.profileImage,
                    role: updatedUser.role
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get user profile by ID
 * @route   GET /api/users/profile/:id
 * @access  Public
 */
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (user) {
            res.json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    gender: user.gender,
                    profileImage: user.profileImage,
                    role: user.role,
                    about: user.about,
                    experience: user.experience,
                    phoneNumber: user.phoneNumber,
                    socialLinks: user.socialLinks,
                    favorites: user.favorites
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get current user profile (from token)
 * @route   GET /api/users/profile
 * @access  Private
 */
const getCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.email === 'admin@royalplots.com') {
                return res.status(400).json({ success: false, message: 'Cannot delete admin account' });
            }
            await User.deleteOne({ _id: req.params.id });
            res.json({ success: true, message: 'User removed' });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Toggle favorite property
 * @route   POST /api/users/favorite
 * @access  Private
 */
const toggleFavorite = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const isFavorite = user.favorites.includes(propertyId);

        if (isFavorite) {
            user.favorites.pull(propertyId);
        } else {
            user.favorites.push(propertyId);
        }

        await user.save();
        res.json({ success: true, message: isFavorite ? 'Removed from favorites' : 'Added to favorites', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Google Login
 * @route   POST /api/users/google
 * @access  Public
 */
const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        const { name, email, picture } = await googleRes.json();

        if (!email) {
            return res.status(401).json({ success: false, message: 'Invalid Google token' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                profileImage: picture,
                provider: 'google'
            });
        }

        res.json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            profileImage: user.profileImage,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(401).json({ success: false, message: 'Google authentication failed' });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    googleLogin,
    getUserProfile, 
    getCurrentUserProfile,
    updateProfile, 
    getUsers, 
    deleteUser, 
    toggleFavorite 
};
