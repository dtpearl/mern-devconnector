const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({
        errors: errors.array()
      });
    }

    const { name, email, password } = request.body;

    try {
      // See if the user exists (If they exist, return an error. Prevent duplicates of a user.)
      let user = await User.findOne({ email });

      if (user) {
        // Adding a return before a response prevents any further code being run and the process is exited by returning the error.
        return response
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: '200', // Size of the gravatar image
        r: 'pg', // Rating of the gravatar image
        d: 'mm' // The default image if a custom one doesn't exist
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt password using bcryptjs
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return jsonwebtoken so they can be logged in immediately after registration.
      // Mongoose allows you to use .id instead of ._id
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 3600000 },
        (err, token) => {
          if (err) throw err;
          response.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      response.status(500).send('Server error');
    }
  }
);

module.exports = router;
