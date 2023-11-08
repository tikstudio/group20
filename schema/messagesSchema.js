import Joi from 'joi';

export default {
  send: Joi.object({
    friendId: Joi.number().required(),
    text: Joi.string().allow('').required(),
    type: Joi.string().allow('text', 'voice', 'video'),
  }),
};
