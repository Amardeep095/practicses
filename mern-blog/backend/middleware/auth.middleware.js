// auth.middleware.js
// Guards protected routes — like a bouncer at a club
// Request comes in → Check wristband (JWT) → Let in or reject

import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

export const protect = async (req, res, next) => {
  let token

  // JWT is sent in Authorization header as: "Bearer eyJhbGci..."
  // We check for this exact format
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Split "Bearer eyJhbGci..." → ["Bearer", "eyJhbGci..."]
    // Take index [1] = just the token
    token = req.headers.authorization.split(' ')[1]
  }

  // No token = not authenticated
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token provided')
  }

  // jwt.verify() does two things:
  // 1. Verifies the token hasn't been tampered with (signature check)
  // 2. Checks the token hasn't expired
  // If either fails, it throws an error (caught by express-async-errors)
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  // decoded = { id: "userId", iat: timestamp, exp: timestamp }

  // Fetch the user from DB to ensure they still exist
  // (Token could be valid but user was deleted)
  // select('-password') = exclude password field
  const user = await User.findById(decoded.id).select('-password')

  if (!user) {
    res.status(401)
    throw new Error('User no longer exists')
  }

  if (!user.isActive) {
    res.status(401)
    throw new Error('Account has been deactivated')
  }

  // Attach user to request object
  // Now every route after this middleware has access to req.user
  req.user = user
  next()
}

// Admin-only middleware
// Always use AFTER protect — protect sets req.user
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next()
  }
  res.status(403)
  throw new Error('Admin access required')
}

// Post owner OR admin middleware
// For routes like "edit post" — author or admin can edit
export const ownerOrAdmin = (Model) => async (req, res, next) => {
  const document = await Model.findById(req.params.id)

  if (!document) {
    res.status(404)
    throw new Error('Resource not found')
  }

  const isOwner = document.author?.toString() === req.user._id.toString()
  const isAdmin = req.user.role === 'admin'

  if (!isOwner && !isAdmin) {
    res.status(403)
    throw new Error('Not authorized to perform this action')
  }

  req.document = document  // Attach for use in controller
  next()
}