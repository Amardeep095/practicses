import jwt from 'jsonwebtoken'
import User from '../models/User.model.js'

// ─────────────────────────────────────────────
// Helper: Generate JWT token
// Kept here because only auth controller needs it
// ─────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },               // Payload: what to encode in the token
    process.env.JWT_SECRET,       // Secret: used to sign + verify
    { expiresIn: process.env.JWT_EXPIRES_IN }  // Token lifespan
  )
}

// Helper: Send token + user data response
// Keeps the response format consistent across register/login
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id)

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
    },
  })
}

// ─────────────────────────────────────────────
// @route   POST /api/auth/register
// @access  Public
// ─────────────────────────────────────────────
export const registerUser = async (req, res) => {
  // Destructure expected fields from request body
  const { name, email, password } = req.body

  // Check if user already exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('Email already registered')
  }

  // Create user — password hashing happens in the model's pre-save hook
  const user = await User.create({ name, email, password })

  // 201 = Created (not 200 OK — semantically correct for new resource)
  sendTokenResponse(user, 201, res)
}

// ─────────────────────────────────────────────
// @route   POST /api/auth/login
// @access  Public
// ─────────────────────────────────────────────
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please provide email and password')
  }

  // '+password' overrides the select:false on the password field
  // We NEED the password here to compare it
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    // Vague message intentional — don't reveal whether email exists
    res.status(401)
    throw new Error('Invalid credentials')
  }

  // Use the instance method defined on the User model
  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    res.status(401)
    throw new Error('Invalid credentials')
  }

  sendTokenResponse(user, 200, res)
}

// ─────────────────────────────────────────────
// @route   GET /api/auth/me
// @access  Private (requires JWT)
// ─────────────────────────────────────────────
export const getMe = async (req, res) => {
  // req.user was attached by the protect middleware
  // Re-fetch to get latest data with populated bookmarks
  const user = await User.findById(req.user._id).populate('bookmarks', 'title slug coverImage')

  res.json({
    success: true,
    user,
  })
}

// ─────────────────────────────────────────────
// @route   PUT /api/auth/update-profile
// @access  Private
// ─────────────────────────────────────────────
export const updateProfile = async (req, res) => {
  const { name, bio, avatar } = req.body

  // findByIdAndUpdate with { new: true } returns the UPDATED document
  // Without { new: true } it returns the document BEFORE the update
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { name, bio, avatar },
    { new: true, runValidators: true }  // runValidators = apply schema rules
  )

  res.json({
    success: true,
    user: updatedUser,
  })
}