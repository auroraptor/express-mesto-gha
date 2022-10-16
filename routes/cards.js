const router = require('express').Router();
const {
  createCard, getCards, removeCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', removeCard);
router.put('/:id/likes', likeCard);
router.put('//likes', likeCard);
router.delete('/:id/likes', dislikeCard);

module.exports = router;
