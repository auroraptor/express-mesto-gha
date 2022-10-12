const Card = require('../models/card');

// eslint-disable-next-line no-console
const log = (...args) => console.log(...args);

const createCard = (req, res) => {
  log(req.user._id); // _id станет доступен
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => log(err.message))
    .finally(() => log('😌'));
};

const getCards = (req, res) => {
  log('let\'s do this thing');
  return Card.find({})
    .then((cards) => {
      log('don\'t you know');
      log(cards);
      res.send({ cards });
    })
    .catch((err) => {
      log('let\'s not and say we did');
      res.send({ message: err.message });
    })
    .finally(() => log('don\'t you say it\'s over'));
};

const deleteCard = (req, res) => {
  log('delete');
  log(req.params.id);

  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => res.send(err.message));
};

module.exports = { createCard, getCards, deleteCard };
