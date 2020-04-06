const router = require('express').Router();
const usersRoute = require('./users');

router.use('/users', usersRoute);

module.exports = router;
