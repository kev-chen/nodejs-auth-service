const router = require('express').Router();
const User = require('../models/User');
const validationSchemas = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res, next) => {
  // Validate the data before adding a user
  const { error } = validationSchemas.registration.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the user is already in the database
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send('Email already exists');

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  // Try to save the user
  try {
    const savedUser = await user.save();
    res.send({ user: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login', async (req, res, next) => {
  // Validate the data before adding a user
  const { error } = validationSchemas.login.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(401).send('Email is incorrect');

  // Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Password is incorrect');

  // Create and assign a token
  const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
    algorithm: 'HS256',
    expiresIn: 60 * 60,
  });

  res.header('Access-Token', token);

  res.send({ access_token: token });
});

module.exports = router;
