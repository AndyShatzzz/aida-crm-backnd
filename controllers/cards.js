const Card = require('../models/card');
const { ErrorBadRequest, ErrorNotFound, ErrorForbidden } = require('../errors/errors');
const errorMessage = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((error) => next(error));
};

module.exports.postCard = (req, res, next) => {
  const userId = req.user._id;

  const { name, link } = req.body;

  Card.create({ name, link, owner: userId })
    .then((newCard) => {
      res.status(201).send(newCard);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new ErrorBadRequest(errorMessage.validationErrorMessage));
      } else {
        next(error);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound(errorMessage.cardNotFoundMessage);
      }
      if (userId !== card.owner.toString()) {
        throw new ErrorForbidden(errorMessage.forbiddenMessage);
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then((removedCard) => res.send(removedCard))
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrorBadRequest(errorMessage.cardBadRequestMessage));
      } else if (error.name === 'Forbidden') {
        next(new ErrorForbidden(errorMessage.forbiddenMessage));
      } else {
        next(error);
      }
    });
};

module.exports.putCardLike = (req, res, next) => {
  const userId = req.user._id;

  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound(errorMessage.cardNotFoundMessage));
      } else {
        res.send({ data: card });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrorBadRequest(errorMessage.cardBadRequestMessage));
      } else {
        next(error);
      }
    });
};

module.exports.putDislikeCard = (req, res, next) => {
  const userId = req.user._id;

  const { cardId } = req.params;
  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound(errorMessage.cardNotFoundMessage));
      } else {
        res.send({ data: card });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        next(new ErrorBadRequest(errorMessage.cardBadRequestMessage));
      } else {
        next(error);
      }
    });
};
