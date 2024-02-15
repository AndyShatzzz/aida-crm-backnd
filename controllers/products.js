const Product = require("../models/product");
const {
  ErrorBadRequest,
  ErrorNotFound,
  ErrorForbidden,
} = require("../errors/errors");
const errorMessage = require("../utils/constants");

module.exports.getProducts = (req, res, next) => {
  Product.find({})
    .then((products) => res.send(products))
    .catch((error) => next(error));
};

module.exports.postProduct = (req, res, next) => {
  const userId = req.user._id;

  const { name, quantity, price, image } = req.body;

  Product.create({
    name,
    quantity,
    price,
    image,
    owner: userId,
  })
    .then((newProduct) => {
      res.status(201).send(newProduct);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new ErrorBadRequest(errorMessage.validationErrorMessage));
      } else {
        next(error);
      }
    });
};

module.exports.deleteProduct = (req, res, next) => {
  const { productId } = req.params;
  // const userId = req.user._id;
  // Product.findById(productId)
  //   .then((card) => {
  //     if (!card) {
  //       throw new ErrorNotFound(errorMessage.cardNotFoundMessage);
  //     }
  //     if (userId !== card.owner.toString()) {
  //       throw new ErrorForbidden(errorMessage.forbiddenMessage);
  //     }
  //     return Card.findByIdAndRemove(cardId);
  //   })
  Product.findByIdAndRemove(productId)
    .then((removedProduct) => res.send(removedProduct))
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

module.exports.patchProduct = (req, res, next) => {
  const { productId } = req.params;
  const { name, quantity, price, image } = req.body;

  Product.findByIdAndUpdate(
    productId,
    {
      name,
      quantity,
      price,
      image,
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

module.exports.patchProductQuantity = (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  Product.findByIdAndUpdate(
    productId,
    {
      quantity,
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
