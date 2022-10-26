const jwt = require('jsonwebtoken');
const { HttpStatusCode } = require('../utils/HttpStatusCode');

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('jwt=')) {
    return res.status(HttpStatusCode.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  const token = cookie.replace('jwt=', '');
  let payload;
  try {
    payload = jwt.verify(token, '🔐');
  } catch (err) {
    return res.status(HttpStatusCode.UNAUTHORIZED).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  return next();
};

// Если с токеном что-то не так, мидлвэр должен вернуть ошибку 401;
