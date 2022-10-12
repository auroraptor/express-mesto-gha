const router = require('express').Router();
const { createCard, getCards, deleteCard } = require('../controllers/cards');

// GET /cards — возвращает все карточки
// POST /cards — создаёт карточку
// DELETE /cards/:cardId — удаляет карточку по идентификатору

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:id', deleteCard);

module.exports = router;
