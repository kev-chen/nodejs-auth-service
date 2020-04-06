const assertDto = require('../helpers/assertDto')
const loginDtoValidator = require('../dto/LoginValidator');

const assertLoginDto = (req, res, next) => {
  try {
    assertDto(req.body, loginDtoValidator);
    req.loginDto = req.body;
    next();
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
};

module.exports = assertLoginDto;