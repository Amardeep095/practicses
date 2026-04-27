import express from 'express'
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
} from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router()

// Public routes — no token needed
router.post('/register', registerUser)
router.post('/login', loginUser)

// Private routes — protect middleware checks JWT first
router.get('/me', protect, getMe)
router.put('/update-profile', protect, updateProfile)

export default router