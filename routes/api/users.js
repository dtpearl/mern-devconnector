const express = require('express');
const router = express.Router();

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/', (request, response) => {
  console.log(request.body);
  response.send('User route');
});

module.exports = router;
