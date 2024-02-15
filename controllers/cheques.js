const Cheque = require("../models/cheque");
const Product = require("../models/product");
const {
  ErrorBadRequest,
  ErrorNotFound,
  ErrorForbidden,
} = require("../errors/errors");
const errorMessage = require("../utils/constants");

module.exports.getCheques = (req, res, next) => {
  Cheque.find({})
    .then((cheques) => res.send(cheques))
    .catch((error) => next(error));
};

module.exports.postCheque = (req, res, next) => {
  const userId = req.user._id;

  const { tableNumber, status, productsList, prevState, updatedState } =
    req.body;

  Cheque.create({
    tableNumber,
    status,
    productsList,
    // prevState: [...prevState, prevOwner: userId,],
    prevState: {
      cheque: prevState[0].cheque,
      totalCost: prevState[0].totalCost,
      // cash: prevState[0].cash,
      // card: prevState[0].card,
      prevOwner: userId,
    },
    updatedState,
    owner: userId,
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

module.exports.deleteCheque = (req, res, next) => {
  const { chequeId } = req.params;
  Cheque.findByIdAndRemove(chequeId)
    .then((removedCheque) => res.send(removedCheque))
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

module.exports.patchCheque = (req, res, next) => {
  const { chequeId } = req.params;
  const userId = req.user._id;
  const { productsList, prevState } = req.body;

  Cheque.findByIdAndUpdate(
    chequeId,
    {
      productsList,
      prevState: {
        cheque: prevState[0].cheque,
        totalCost: prevState[0].totalCost,
        prevOwner: userId,
      },
    },
    { new: true, runValidators: true }
  )
    .then((updatedProduct) => {
      if (!updatedProduct) {
        next(new ErrorNotFound(errorMessage.productNotFoundMessage));
      } else {
        res.send(updatedProduct);
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

module.exports.patchChequeStatus = (req, res, next) => {
  const { chequeId } = req.params;
  const { status, productsList } = req.body;

  Cheque.findByIdAndUpdate(
    chequeId,
    {
      status: status,
      productsList: productsList,
    },
    { new: true, runValidators: true }
  )
    .then((updatedProduct) => {
      if (!updatedProduct) {
        next(new ErrorNotFound(errorMessage.productNotFoundMessage));
      } else {
        res.send(updatedProduct);
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

module.exports.putUpdateState = (req, res, next) => {
  const { chequeId } = req.params;
  const userId = req.user._id;
  const { updatedState } = req.body;

  Cheque.findByIdAndUpdate(
    chequeId,
    { $addToSet: { updatedState, updatedOwner: userId } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound(errorMessage.cardNotFoundMessage));
      } else {
        res.send({ data: card });
      }
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new ErrorBadRequest(errorMessage.cardBadRequestMessage));
      } else {
        next(error);
      }
    });
};
