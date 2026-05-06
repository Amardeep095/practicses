import express from 'express'
import User from '../models/User.model.js'
import Post from '../models/Post.model.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = express.Router()

// ─────────────────────────────────────────────
// @route   GET /api/users
// @access  Private + Admin only
// Returns all users (for admin dashboard)
// ─────────────────────────────────────────────
router.get('/', protect, adminOnly, async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20
  const skip = (page - 1) * limit

  const [users, total] = await Promise.all([
    User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments()
  ])

  res.json({
    success: true,
    users,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    }
  })
})

// ─────────────────────────────────────────────
// @route   GET /api/users/:id
// @access  Public
// Returns a single user's public profile + their posts
// ─────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  // Also fetch their published posts
  const posts = await Post.find({ author: req.params.id, status: 'published' })
    .select('title slug excerpt coverImage readTime createdAt')
    .sort({ createdAt: -1 })
    .limit(10)

  res.json({ success: true, user, posts })
})

// ─────────────────────────────────────────────
// @route   PUT /api/users/:id/toggle-active
// @access  Private + Admin only
// Ban / unban a user
// ─────────────────────────────────────────────
router.put('/:id/toggle-active', protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  // Prevent admin from banning themselves
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400)
    throw new Error('You cannot deactivate your own account')
  }

  user.isActive = !user.isActive
  await user.save()

  res.json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    isActive: user.isActive
  })
})

// ─────────────────────────────────────────────
// @route   PUT /api/users/:id/role
// @access  Private + Admin only
// Promote/demote user role
// ─────────────────────────────────────────────
router.put('/:id/role', protect, adminOnly, async (req, res) => {
  const { role } = req.body

  if (!['user', 'admin'].includes(role)) {
    res.status(400)
    throw new Error('Invalid role. Must be "user" or "admin"')
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  ).select('-password')

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  res.json({ success: true, user })
})

// ─────────────────────────────────────────────
// @route   DELETE /api/users/:id
// @access  Private + Admin only
// ─────────────────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  if (user._id.toString() === req.user._id.toString()) {
    res.status(400)
    throw new Error('You cannot delete your own account')
  }

  // Also delete all posts by this user
  await Post.deleteMany({ author: user._id })
  await user.deleteOne()

  res.json({ success: true, message: 'User and their posts deleted successfully' })
})

export default router