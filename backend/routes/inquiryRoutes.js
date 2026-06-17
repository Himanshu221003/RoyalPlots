const express = require('express');
const router = express.Router();
const { getInquiries, createInquiry, updateInquiry } = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getInquiries)
    .post(createInquiry);

router.route('/:id')
    .put(protect, updateInquiry);

module.exports = router;
