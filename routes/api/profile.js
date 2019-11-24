const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (request, response) => {
  try {
    const profile = await Profile.findOne({
      user: request.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return response
        .status(400)
        .json({ msg: 'There is no profile for this user' });
    }

    response.json(profile);
  } catch (err) {
    console.error(err.message);
    response.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create or update a user's profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  }
);

module.exports = router;
