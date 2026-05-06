import express from 'express'
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
} from '../controllers/post.controller.js'
import { protect, ownerOrAdmin } from '../middleware/auth.middleware.js'
import Post from '../models/Post.model.js'

const router = express.Router()

// Public
router.get('/', getAllPosts)
router.get('/:slug', getPostBySlug)

// Private
router.post('/', protect, createPost)
router.put('/:id/like', protect, toggleLike)
router.post('/:id/comments', protect, addComment)

// Owner or Admin only
router.put('/:id', protect, ownerOrAdmin(Post), updatePost)
router.delete('/:id', protect, ownerOrAdmin(Post), deletePost)

export default router