const { celebrate, Joi } = require('celebrate');
const regex = require('../utils/validationRegex');
const validateId = require('../utils/validateId');

module.exports.validateUserGetId = celebrate({
  params: Joi.object().keys({
    userId: validateId,
  }),
});

module.exports.validateDeleteCard = celebrate({
  params: Joi.object().keys({
    cardId: validateId,
  }),
});

module.exports.validateCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(regex),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports.validatePatchUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

module.exports.validatePatchUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regex),
  }),
});

module.exports.validatePostCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(regex),
  }),
});

module.exports.validateCardLike = celebrate({
  params: Joi.object().keys({
    cardId: validateId,
  }),
});

module.exports.validateCardDislike = celebrate({
  params: Joi.object().keys({
    cardId: validateId,
  }),
});
