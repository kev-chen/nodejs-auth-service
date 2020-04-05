const Joi = require('@hapi/joi');

userValidator = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required().email().max(255),
  passwordHash: Joi.binary().length(64).required(),
  passwordSalt: Joi.binary().length(128).required(),
});

module.exports = userValidator;
