const { HttpStatusCode } = require('../utils/HttpStatusCode');

class HTTP404Error extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HttpStatusCode.NOT_FOUND;
  }
}

module.exports = { HTTP404Error };
