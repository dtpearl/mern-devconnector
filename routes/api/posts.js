const express = require('express');
const router = express.Router();

// @route   GET api/posts
// @desc    Test route
// @access  Public
router.get('/', (reqest, response) => response.send('Posts route'));

module.exports = router;
