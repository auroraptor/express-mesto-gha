const { BaseError } = require('./BaseError');
const { HttpStatusCode } = require('../utils/HttpStatusCode');

class APIError extends BaseError {
  constructor(name, httpCode = HttpStatusCode.INTERNAL_SERVER, description = 'internal server error') {
    super(name, httpCode, description);
  }
}

module.exports = { APIError };
