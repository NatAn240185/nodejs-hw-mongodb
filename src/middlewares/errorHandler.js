import { isHttpError } from 'http-errors';

export function errorHandler(error, req, res, next) {
  if (isHttpError(error) === true) {
    return res
      .status(error.statusCode)
      .send({ status: error.statusCode, message: error.message });
  }

  res.status(500).send({ status: 500, message: 'Something went wrong' });
}