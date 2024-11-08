const Table = require("../models/table");
const {
  ErrorBadRequest,
  ErrorNotFound,
  ErrorForbidden,
} = require("../errors/errors");
const errorMessage = require("../utils/constants");

module.exports.getTables = (req, res, next) => {
  Table.find({})
    .then((table) => res.send(table))
    .catch((error) => next(error));
};

module.exports.postTable = (req, res, next) => {
  const { tableNumber, x, y, width, height } = req.body;

  Table.create({
    tableNumber,
    x,
    y,
    width,
    height,
  })
    .then((newCheque) => {
      res.status(201).send(newCheque);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new ErrorBadRequest(errorMessage.validationErrorMessage));
      } else {
        next(error);
      }
    });
};
