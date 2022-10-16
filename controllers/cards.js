const Card = require('../models/card');

const regex = /`\w+`/gi;
const { logNow } = require('../utils/log');
const { HttpStatusCode } = require('../utils/HttpStatusCode');

module.exports.createCard = async (req, res) => {
  try {
    const card = await Card.create({ ...req.body, owner: req.user._id });
    const response = await res.status(HttpStatusCode.OK).send({ id: card._id });
    return response;
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
    const response = await res.status(HttpStatusCode.OK).send({ data: cards });
    return response;
  } catch (error) {
    logNow(error.name);

    return res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: 'Тут что-то не так' });
  }
};

module.exports.removeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndRemove(req.params.cardId);
    if (card === null) {
      return res.status(HttpStatusCode.NOT_FOUND).send({ message: `Карточка с id ${req.params.cardId} не найдена` });
    }
    const response = await res.status(HttpStatusCode.OK).send({ message: `Карточка с id ${req.params.cardId} удалена` });
    return response;
  } catch (error) {
    logNow(error.name);

    if (error.name === 'CastError') {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Некорректный запрос' });
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: 'Тут что-то не так' });
  }
};

module.exports.likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card === null) {
      return res.status(HttpStatusCode.NOT_FOUND).send({ message: `Карточка с id ${req.params.id} не найдена` });
    }
    const response = await res.status(HttpStatusCode.OK).send({ message: '❤️' });
    return response;
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
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    );
    if (card === null) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: `Карточка с id ${req.params.id} не найдена` });
    }
    const response = await res.status(HttpStatusCode.OK).send({ message: '💔' });
    return response;
  } catch (error) {
    logNow(error.name);

    if (error.name === 'CastError') {
      return res.status(HttpStatusCode.BAD_REQUEST).send({ message: 'Некорректный запрос' });
    }

    return res.status(HttpStatusCode.INTERNAL_SERVER).send({ message: 'Тут что-то не так' });
  }
};
