const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    googleLogin,
    getUserProfile, 
    getCurrentUserProfile,
    updateProfile, 
    getUsers, 
    deleteUser, 
    toggleFavorite 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);

// Profile Routes (Place /profile before parameterized /profile/:id)
router.get('/profile', protect, getCurrentUserProfile);
router.get('/profile/:id', getUserProfile);

// Private Routes
router.get('/', getUsers);
router.put('/update-profile', protect, updateProfile);
router.post('/favorite', protect, toggleFavorite);
router.delete('/:id', protect, deleteUser);

module.exports = router;
