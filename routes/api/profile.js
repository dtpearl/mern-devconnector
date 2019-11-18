const express = require('express');
const router = express.Router();

// @route   GET api/profile
// @desc    Test route
// @access  Public
router.get('/', (reqest, response) => response.send('Profile route'));

module.exports = router;
