const express = require('express');
const router = express.Router();

// @route   GET api/users
// @desc    Test route
// @access  Public
router.get('/', (reqest, response) => response.send('User route'));

module.exports = router;
