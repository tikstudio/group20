import Joi from 'joi';

export default {
  login: Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
  }),
  register: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().required(),
  }),
  list: Joi.object({
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(100),
    s: Joi.string().trim().allow(''),
  }),
};
