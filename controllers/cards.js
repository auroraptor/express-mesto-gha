const Card = require('../models/card');
const { log } = require('../utils/log');

const createCard = (req, res) => Card.create({ ...req.body, owner: req.user._id })
  .then((card) => res.send(card))
  .catch((err) => log(err.message));

const getCards = (req, res) => Card.find({})
  .then((cards) => res.send({ cards }))
  .catch((err) => res.send({ message: err.message }));

const deleteCard = (req, res) => Card.findByIdAndRemove(req.params.id)
  .then((card) => res.send({ data: card }))
  .catch((err) => res.send(err.message));

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then((card) => {
  res.send(card);
}).catch((err) => log(err.message));

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
).then((card) => res.send(card))
  .catch((err) => log(err.message));

module.exports = {
  createCard, getCards, deleteCard, likeCard, dislikeCard,
};
