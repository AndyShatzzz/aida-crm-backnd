const { Joi } = require('celebrate');

const validateId = Joi.string().alphanum().length(24).hex();

module.exports = validateId;
