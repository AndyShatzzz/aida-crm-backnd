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
  const { tables } = req.body;

  Table.create({ tables })
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

module.exports.patchTables = (req, res, next) => {
  const { tableId } = req.params;
  const { tables } = req.body;

  Table.findByIdAndUpdate(
    tableId,
    {
      tables,
    },
    { new: true, runValidators: true }
  )
    .then((updatedTables) => {
      if (!updatedTables) {
        next(new ErrorNotFound(errorMessage.productNotFoundMessage));
      } else {
        res.send(updatedTables);
      }
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new ErrorBadRequest(errorMessage.validationErrorMessage));
      } else {
        next(error);
      }
    });
};
