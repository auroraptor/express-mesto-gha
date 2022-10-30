const jwt = require('jsonwebtoken');
const { HTTP401Error } = require('../errors/HTTP401Error');

module.exports = (req, res, next) => {
  let payload;
  try {
    const token = req.cookies.jwt;
    payload = jwt.verify(token, '🔐');
  } catch (err) {
    next(new HTTP401Error('Необходима авторизация'));
    return;
  }
  req.user = payload;
  next();
};
