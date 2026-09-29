export function notFound(req, res, next) {
  res.status(404);
  next(new Error(`Route not found: ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : err.status || 500;

  res.status(statusCode).json({
    message: err.publicMessage || err.message || "Something went wrong.",
    status: statusCode
  });
}

