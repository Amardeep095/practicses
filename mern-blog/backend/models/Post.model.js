import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema(
  {
    // Embedded document — stored INSIDE the post
    // Good choice for comments: they're always fetched with their post
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Comment cannot be empty'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
)

const postSchema = new mongoose.Schema(
  {
    // ── Core Content ─────────────────────────
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    // Slug = URL-friendly version of the title
    // "My First Post!" → "my-first-post"
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    content: {
      type: String,
      required: [true, 'Post content is required'],
    },

    excerpt: {
      type: String,
      maxlength: [300, 'Excerpt cannot exceed 300 characters'],
    },

    coverImage: {
      type: String,
      default: '',
    },

    // ── Categorization ────────────────────────
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Technology', 'Programming', 'Design', 'Career', 'Tutorial', 'Other'],
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      }
    ],

    // ── Relationships ─────────────────────────
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ── Engagement ────────────────────────────
    // Storing user IDs in likes array:
    // - Check if user liked: likes.includes(userId) → O(n) but n is small
    // - Get count: likes.length → instant
    // - Toggle like: one atomic $addToSet / $pull operation
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],

    comments: [commentSchema],  // Embedded array of comment subdocuments

    views: {
      type: Number,
      default: 0,
    },

    // ── Status ────────────────────────────────
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },

    readTime: {
      type: Number,  // in minutes — calculated before save
      default: 1,
    },
  },
  { timestamps: true }
)

// ─────────────────────────────────────────────
// INDEXES
// Like a book's index — speeds up common searches
// ─────────────────────────────────────────────
// Text index enables full-text search: Post.find({ $text: { $search: 'react' } })
postSchema.index({ title: 'text', content: 'text', tags: 'text' })
postSchema.index({ slug: 1 })    // 1 = ascending index for slug lookups
postSchema.index({ author: 1 })  // Fast author-based queries
postSchema.index({ category: 1, createdAt: -1 })  // Category + newest first

// ─────────────────────────────────────────────
// PRE-SAVE HOOKS
// ─────────────────────────────────────────────
postSchema.pre('save', function (next) {
  // Auto-generate slug from title if not provided or title changed
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')   // Remove special characters
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/-+/g, '-')        // Replace multiple - with single -
      .trim()
  }

  // Auto-calculate read time
  // Average reading speed = ~200 words per minute
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length
    this.readTime = Math.ceil(wordCount / 200)
  }

  // Auto-generate excerpt from content if not provided
  if (!this.excerpt && this.content) {
    // Strip HTML tags (if rich text), take first 200 chars
    this.excerpt = this.content
      .replace(/<[^>]*>/g, '')
      .substring(0, 200)
      .trim() + '...'
  }

  next()
})

// ─────────────────────────────────────────────
// VIRTUAL FIELDS
// Computed properties — not stored in DB, calculated on the fly
// ─────────────────────────────────────────────
postSchema.virtual('likeCount').get(function () {
  return this.likes.length
})

postSchema.virtual('commentCount').get(function () {
  return this.comments.length
})

// Must set this for virtuals to appear in JSON responses
postSchema.set('toJSON', { virtuals: true })

const Post = mongoose.model('Post', postSchema)
export default Post