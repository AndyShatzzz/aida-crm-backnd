const router = require('express').Router();

const {
  getCards,
  postCard,
  deleteCard,
  putCardLike,
  putDislikeCard,
} = require('../controllers/cards');

const {
  validateDeleteCard,
  validatePostCard,
  validateCardLike,
  validateCardDislike,
} = require('../middlewares/validation');

router.get('/', getCards);
router.post('/', validatePostCard, postCard);
router.delete('/:cardId', validateDeleteCard, deleteCard);
router.put('/:cardId/likes', validateCardLike, putCardLike);
router.delete('/:cardId/likes', validateCardDislike, putDislikeCard);

module.exports = router;
