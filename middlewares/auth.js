const jwt = require('jsonwebtoken');
const { HttpStatusCode } = require('../utils/HttpStatusCode');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.jwt;
    payload = jwt.verify(token, '🔐');
  } catch (err) {
    res.status(HttpStatusCode.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
    return;
  }
  req.user = payload;
  next();
};
