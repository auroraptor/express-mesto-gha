const jwt = require('jsonwebtoken');
const HttpStatusCode = require('../utils/HttpStatusCode');
const baerer = require('../utils/regexps');

module.export = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startWith(baerer)) {
    return res.status(HttpStatusCode.UNATHORIZED).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace(baerer, '');
  let payload;
  try {
    payload = jwt.verify(token, '🔐');
  } catch (err) {
    return res.status(HttpStatusCode.UNATHORIZED).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  return next();
};

// Если с токеном что-то не так, мидлвэр должен вернуть ошибку 401;
