const router = require('express').Router();
const User = require('../models/User');
const validationSchemas = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const constants = require('../common/constants');

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
  if (!user) return res.status(400).send('The email or password is incorrect.');

  // Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('The email or password is incorrect.');

  // Create and assign a token
  const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
    algorithm: 'HS256',
    expiresIn: constants.EXPIRES_IN,
  });

  // Two cookie authentication scheme
  // See https://miro.medium.com/max/1400/1*zwssp_fcvLG12uk3nuTgvA.png
  let [header, payload, signature] = token.split('.');
  res.cookie(constants.JWT_SIGNATURE_COOKIE, signature, {
    maxAge: constants.EXPIRES_IN * 1000,
    httpOnly: true,
    // secure: true,
  });

  res.cookie(constants.JWT_HEADER_PAYLOAD_COOKIE, `${header}.${payload}`, {
    maxAge: constants.EXPIRES_IN * 1000,
    // secure: true,
  });

  res.send({ message: 'Successfully logged in' });
});

module.exports = router;
