const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createCard, getCards, removeCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', celebrate({
  body: Joi.object().keys({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
}), removeCard);

router.put('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  body: Joi.object().keys({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
}), dislikeCard);

module.exports = router;
