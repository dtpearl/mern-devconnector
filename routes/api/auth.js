const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User'); // Bring in the User model

// @route   GET api/auth
// @desc    Test route
// @access  Public
// Using auth as second parameter, this becomes a protected route.
router.get('/', auth, async (reqest, response) => {
  try {
    const user = await User.findById(reqest.user.id); //.select('-password');  .select('-password') takes password out of the returned data.
    response.json(user);
  } catch (err) {
    console.error(err.message);
    response.status(500).send('Server error 1');
  }
});

// @route   POST api/auth
// @desc    Authenticate a user and get a token.
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array()
      });
    }

    const { email, password } = request.body;

    try {
      // See if the user exists.
      let user = await User.findOne({ email });

      if (!user) {
        // Adding a return before a response prevents any further code being run and the process is exited by returning the error.
        return response
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }
      // Check for the correct password.
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return response
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // Return jsonwebtoken so they can be logged in.
      // Mongoose allows you to use .id instead of ._id
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600000 }, // TODO Set this to expire
        (err, token) => {
          if (err) throw err;
          response.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      response.status(500).send('Server error 2');
    }
  }
);

module.exports = router;
