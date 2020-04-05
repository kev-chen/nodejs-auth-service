const Joi = require('@hapi/joi');

loginValidator = Joi.object({
  username: Joi.string().required().email().max(255),
  password: Joi.string().min(8).required(),
});

module.exports = loginValidator;
