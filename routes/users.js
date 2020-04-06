const router = require('express').Router();
const jwt = require('jsonwebtoken');
const constants = require('../common/constants');
const usersService = require('../services/UserService');
const assertLoginDto = require('../middleware/assertLoginDto');
const assertRegisterDto = require('../middleware/assertRegisterDto');

router.post('/', assertRegisterDto,  async (req, res, next) => {
  try {
    await usersService.create(req.registerDto);
    return res.status(201).send();
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
});

router.post('/login', assertLoginDto,  async (req, res, next) => {
  try {
    let authenticatedUser = await usersService.authenticate(req.loginDto);
    if (!authenticatedUser)
      return res.status(400).send({ message: 'The username or password is incorrect' });

    // Issue a JWT
    // unique_name is a required field for ASP.NET Core 3.1 Identity.Name Claim
    const token = jwt.sign({ unique_name: authenticatedUser.Id }, process.env.SECRET, {
      algorithm: 'HS256',
      expiresIn: constants.EXPIRES_IN,
      notBefore: 0,
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

    res.status(200).json({
      id: authenticatedUser.Id,
      username: authenticatedUser.Username,
      firstName: authenticatedUser.FirstName,
      lastName: authenticatedUser.LastName,
      token,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({ message: e.message });
  }
});

module.exports = router;
