const Joi = require('@hapi/joi');

registerValidator = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  username: Joi.string().required().email().max(255),
  password: Joi.string().min(8).required(),
});

module.exports = registerValidator;
