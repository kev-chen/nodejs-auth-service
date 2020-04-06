const assertDto = require('../helpers/assertDto')
const registerDtoValidator = require('../dto/RegisterValidator');

const assertLoginDto = (req, res, next) => {
  try {
    assertDto(req.body, registerDtoValidator);
    req.registerDto = req.body;
    next();
  } catch (e) {
    return res.status(400).send({ message: e.message });
  }
};

module.exports = assertLoginDto;