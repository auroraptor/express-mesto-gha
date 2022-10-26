const Card = require('../models/card');

const regex = /`\w+`/gi;
const { logNow } = require('../utils/log');
const { HttpStatusCode } = require('../utils/HttpStatusCode');
const { HTTP404Error } = require('../errors/HTTP404Error');
const { HTTP403Error } = require('../errors/HTTP403Error');
// const { APIError } = require('../errors/APIError');

module.exports.createCard = async (req, res) => {
  try {
    const card = await Card.create({ ...req.body, owner: req.user._id });
    return res.status(HttpStatusCode.OK).send(card);
  } catch (error) {
    logNow(error.name);

    if (error.name === 'ValidationError') {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: `Ошибка валидации данных: ${error.message.match(regex)}` });
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: 'Тут что-то не так' });
  }
};

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(HttpStatusCode.OK).send({ data: cards });
  } catch (error) {
    logNow(error.name);

    return res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: 'Тут что-то не так' });
  }
};

module.exports.removeCard = async (req, res, next) => {
  const card = await Card.findById(req.params.cardId);
  if (card === null) {
    next(new HTTP404Error(`Карточка с id ${req.params.cardId} не найдена`));
    return;
  } if (card.owner.toHexString() !== req.user._id) {
    next(new HTTP403Error('Можно удалять только свои карточки'));
    return;
  }
  await Card.delete(req.params.cardId);
  res.status(HttpStatusCode.OK).send({ message: `Карточка с id ${req.params.cardId} удалена` });
};

module.exports.likeCard = async (req, res) => {
  logNow('params: ', req.params);
  logNow('cardId likes', req.params.cardId);
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card === null) {
      return res.status(HttpStatusCode.NOT_FOUND).send({ message: `Карточка с id ${req.params.id} не найдена` });
    }
    return res.status(HttpStatusCode.OK).send({ message: '<3' });
  } catch (error) {
    logNow(error.name);

    if (error.name === 'CastError') {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Некорректный запрос' });
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: 'Тут что-то не так' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card === null) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: `Карточка с id ${req.params.id} не найдена` });
    }
    return res.status(HttpStatusCode.OK).send({ message: '</3' });
  } catch (error) {
    logNow(error.name);

    if (error.name === 'CastError') {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Некорректный запрос' });
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: 'Тут что-то не так' });
  }
};
