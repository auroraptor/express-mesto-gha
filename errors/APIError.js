const { BaseError } = require('./BaseError');
const { HttpStatusCode } = require('../utils/HttpStatusCode');

class APIError extends BaseError {
  constructor(name, statusCode = HttpStatusCode.INTERNAL_SERVER, description = 'internal server error') {
    super(name, statusCode, description);
  }
}

module.exports = { APIError };
