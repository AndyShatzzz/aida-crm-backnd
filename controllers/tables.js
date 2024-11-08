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
    .then((newTable) => {
      res.status(201).send(newTable);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new ErrorBadRequest(errorMessage.validationErrorMessage));
      } else {
        next(error);
      }
    });
};

module.exports.deleteTable = (req, res, next) => {
  const { tableId } = req.params;
  Table.findByIdAndRemove(tableId)
    .then((removedTable) => res.send(removedTable))
    .catch((error) => {
      if (error.name === "CastError") {
        next(new ErrorBadRequest(errorMessage.cardBadRequestMessage));
      } else if (error.name === "Forbidden") {
        next(new ErrorForbidden(errorMessage.forbiddenMessage));
      } else {
        next(error);
      }
    });
};
