// VALIDATION
const Joi = require('@hapi/joi');

const validationSchemas = {
  registration: Joi.object({
    name: Joi.string()
      .min(6)
      .required(),
    email: Joi.string()
      .required()
      .email()
      .max(255),
    password: Joi.string()
      .min(8)
      .required(),
  }),
  login: Joi.object({
    email: Joi.string()
      .required()
      .email()
      .max(255),
    password: Joi.string()
      .min(8)
      .required(),
  }),
};

module.exports = validationSchemas;
