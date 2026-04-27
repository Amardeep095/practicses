// server.js — The front door of your entire backend application
// Think of this as the main() function — it boots everything up

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import 'express-async-errors'  // Must be imported early — patches async error handling

import connectDB from './config/db.js'

// Routes (we'll create these soon)
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/post.routes.js'
import userRoutes from './routes/user.routes.js'

// Error middleware (must be imported here, used at bottom)
import { errorHandler, notFound } from './middleware/error.middleware.js'

// Load .env variables into process.env
// Must happen before anything that uses process.env
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

// ─────────────────────────────────────────────
// MIDDLEWARE STACK
// Think of this as a conveyor belt — every request
// passes through each middleware in order
// ─────────────────────────────────────────────

// helmet() adds security headers (XSS protection, etc.) automatically
app.use(helmet())

// CORS: allows requests from your React frontend
// Without this, browser blocks all requests from port 5173 to port 5000
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com'  // Only allow your domain in prod
    : 'http://localhost:5173',             // Dev frontend URL
  credentials: true,  // Allow cookies/auth headers
}))

// Parse incoming JSON request bodies
// Without this, req.body is undefined when frontend sends JSON
app.use(express.json({ limit: '10mb' }))  // limit prevents large payload attacks

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }))

// Morgan: logs every request to console in dev
// "dev" format: GET /api/posts 200 45ms - 1.2kb
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────
// All auth routes: /api/auth/login, /api/auth/register, etc.
app.use('/api/auth', authRoutes)

// All post routes: /api/posts, /api/posts/:id, etc.
app.use('/api/posts', postRoutes)

// All user routes: /api/users, /api/users/:id, etc.
app.use('/api/users', userRoutes)

// Health check — useful for deployment monitoring
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ─────────────────────────────────────────────
// ERROR HANDLING MIDDLEWARE
// These MUST come AFTER routes
// Express knows they're error handlers by the (err, req, res, next) signature
// ─────────────────────────────────────────────

// Handles requests to routes that don't exist
app.use(notFound)

// Handles all errors thrown anywhere in the app
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})