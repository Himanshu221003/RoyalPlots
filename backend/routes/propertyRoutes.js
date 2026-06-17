const express = require('express');
const router = express.Router();
const { getProperties, createProperty, updateProperty, deleteProperty } = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProperties)
    .post(protect, createProperty);

router.route('/:id')
    .put(protect, updateProperty)
    .delete(protect, deleteProperty);

module.exports = router;
