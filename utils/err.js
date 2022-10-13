function errorHandler(error, request, response, next) {
  if (error.status === 401 && error.message === 'Unauthorized') {
    const status = 401;
    const message = 'Requires authentication';

    response.status(status).json({ message });

    return;
  }

  if (error.status === 400 && error.message === 'Bad Request') {
    const status = 400;
    const message = 'Bad syntax';

    response.status(status).json({ message });

    return;
  }

  if (error.status === 401
    && error.code === 'invalid_token'
    && error.message === 'Permission denied') {
    const status = 403;
    const { message } = error;

    response.status(status).json({ message });

    return;
  }

  const status = error.statusCode || error.code || 500;
  const message = error.message || 'internal error';

  response.status(status).json({ message });
}

module.exports = {
  errorHandler,
};
