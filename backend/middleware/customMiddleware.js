const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  logger.info('API Request', {
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    ip: req.ip,
    userId: req.user ? req.user._id : 'anonymous'
  });

  // Log response
  const originalSend = res.send;
  res.send = function (data) {
    logger.info('API Response', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime: Date.now() - req._startTime
    });
    originalSend.apply(res, arguments);
  };

  req._startTime = Date.now();
  next();
};

const errorLogger = (error, req, res, next) => {
  logger.error('API Error', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    ip: req.ip,
    userId: req.user ? req.user._id : 'anonymous'
  });
  next(error);
};

const unknownEndpoint = (request, response) => {
  logger.warn('Unknown endpoint accessed', {
    method: request.method,
    path: request.path
  });
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error('Error handler caught error', {
    error: error.message,
    stack: error.stack
  });

  response.status(500);
  response.json({
    message: error.message,
  });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  errorLogger,
};
