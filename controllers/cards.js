const Card = require('../models/card');

const { HttpStatusCode } = require('../utils/HttpStatusCode');
const { HTTP404Error } = require('../errors/HTTP404Error');
const { HTTP403Error } = require('../errors/HTTP403Error');

module.exports.createCard = async (req, res, next) => {
  try {
    const card = await Card.create({ ...req.body, owner: req.user._id });
    res.status(HttpStatusCode.OK).send(card);
  } catch (error) {
    next(error);
  }
};

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(HttpStatusCode.OK).send({ data: cards });
  } catch (error) {
    next(error);
  }
};

module.exports.removeCard = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (card === null) {
      next(new HTTP404Error(`Карточка с id ${req.params.cardId} не найдена`));
      return;
    } if (card.owner.toHexString() !== req.user._id) {
      next(new HTTP403Error('Можно удалять только свои карточки'));
      return;
    }
    await card.delete();
    res.status(HttpStatusCode.OK).send({ message: `Карточка с id ${req.params.cardId} удалена` });
  } catch (error) {
    next(error);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card === null) {
      next(new HTTP404Error(`Карточка с id ${req.params.cardId} не найдена`));
      return;
    }
    res.status(HttpStatusCode.OK).send({ message: '<3' });
  } catch (error) {
    next(error);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card === null) {
      next(new HTTP404Error(`Карточка с id ${req.params.cardId} не найдена`));
      return;
    }
    res.status(HttpStatusCode.OK).send({ message: '</3' });
  } catch (error) {
    next(error);
  }
};
