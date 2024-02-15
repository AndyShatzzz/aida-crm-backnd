const { ErrorNotFound } = require('../errors/errors');
const errorMessage = require('../utils/constants');

const defaultErrorNotFound = (req, res, next) => {
  next(new ErrorNotFound(errorMessage.defaultNotFoundMessage));
};

module.exports = defaultErrorNotFound;
