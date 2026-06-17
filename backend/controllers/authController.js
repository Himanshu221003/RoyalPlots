const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'royalplots-super-secret-key-12345', {
        expiresIn: '30d',
    });
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    const { token } = req.body; // This is the access_token from the frontend

    try {
        // Fetch user info from Google using the access_token
        const googleRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        const { name, email, picture } = await googleRes.json();

        if (!email) {
            return res.status(401).json({ message: 'Invalid Google token' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                profileImage: picture,
                provider: 'google'
            });
        } else if (user.provider === 'local') {
             // Link accounts if email matches but provider was local (optional logic)
             user.provider = 'google';
             user.profileImage = user.profileImage || picture;
             await user.save();
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            profileImage: user.profileImage,
            token: generateToken(user._id),
            provider: user.provider
        });
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Google authentication failed' });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, gender, phone } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            gender: gender || 'other',
            phone,
            provider: 'local'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                profileImage: user.profileImage,
                token: generateToken(user._id),
                provider: user.provider
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && user.provider === 'google') {
             return res.status(400).json({ message: 'Please login using Google' });
        }

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                gender: user.gender,
                profileImage: user.profileImage,
                token: generateToken(user._id),
                provider: user.provider
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, googleLogin };
