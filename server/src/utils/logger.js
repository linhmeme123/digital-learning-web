function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on('finish', () => {
    if (!req.path.startsWith('/api')) {
      return;
    }

    const duration = Date.now() - startedAt;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    const message = `[API:${level.toUpperCase()}] ${req.method} ${req.originalUrl} -> ${res.statusCode} ${duration}ms`;

    if (level === 'error') {
      console.error(message);
    } else if (level === 'warn') {
      console.warn(message);
    } else {
      console.log(message);
    }
  });

  next();
}

function logError(req, error, context = 'API error') {
  console.error(`[API:ERROR] ${context} ${req.method} ${req.originalUrl}`);
  console.error(error?.stack || error);
}

module.exports = {
  requestLogger,
  logError,
};
