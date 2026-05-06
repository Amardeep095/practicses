// error.middleware.js
// Centralized error handling — the "catch-all" net for your entire app
// Real-world analogy: Like a bank's customer service department
// Any problem from any branch eventually flows here for resolution

// Handles 404 — route not found
export const notFound = (req, res, next) => {
  // Create an error object with a descriptive message
  const error = new Error(`Route not found: ${req.originalUrl}`)
  res.status(404)
  // Pass to next error handler
  next(error)
}

// Main error handler
// Express identifies error middleware by the 4-parameter signature: (err, req, res, next)
export const errorHandler = (err, req, res, next) => {
  // Sometimes error is thrown with status 200 (success code) by mistake
  // In that case, override to 500 (server error)
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  // ── Handle specific MongoDB/Mongoose errors ──

  // CastError: invalid MongoDB ObjectId format
  // e.g. /api/posts/not-a-valid-id → mongoose throws CastError
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404
    message = 'Resource not found'
  }

  // ValidationError: Mongoose schema validation failed
  // e.g. missing required field, wrong enum value
  if (err.name === 'ValidationError') {
    statusCode = 400
    // Collect ALL validation error messages into one array
    message = Object.values(err.errors).map(e => e.message)
  }

  // Duplicate key error (unique constraint violation)
  // e.g. registering with an email that already exists
  if (err.code === 11000) {
    statusCode = 400
    const field = Object.keys(err.keyValue)[0]  // Which field was duplicated
    message = `${field} already exists`
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired, please login again'
  }

  // Send consistent error response shape
  // Frontend can always expect { success: false, message: "..." }
  res.status(statusCode).json({
    success: false,
    message,
    // Stack trace only in development — never expose internals in production
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}