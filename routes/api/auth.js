const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const User = require('../../models/User'); // Bring in the User model

// @route   GET api/auth
// @desc    Test route
// @access  Public
// Using auth as second parameter, this becomes a protected route.
router.get('/', auth, async (reqest, response) => {
  try {
    const user = await User.findById(reqest.user.id).select('-password'); // .select('-password') takes password out of the returned data.
    response.json(user);
  } catch (err) {
    console.error(err.message);
    response.status(500).send('Server error');
  }
});

module.exports = router;
