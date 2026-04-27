import Post from '../models/Post.model.js'

// ─────────────────────────────────────────────
// @route   GET /api/posts
// @access  Public
// Returns paginated, filterable, searchable posts
// ─────────────────────────────────────────────
export const getAllPosts = async (req, res) => {
  // Query parameters from URL:
  // /api/posts?page=2&limit=10&category=Technology&search=react&sort=popular

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const skip = (page - 1) * limit  // e.g. page 3, limit 10 → skip 20

  // Build query object dynamically
  const query = { status: 'published' }  // Only show published posts

  if (req.query.category) {
    query.category = req.query.category
  }

  if (req.query.tag) {
    query.tags = req.query.tag  // MongoDB: find docs where tags array contains this value
  }

  if (req.query.search) {
    // $text uses the text index we created on the Post model
    query.$text = { $search: req.query.search }
  }

  // Sorting options
  const sortOptions = {
    latest: { createdAt: -1 },   // Newest first
    oldest: { createdAt: 1 },    // Oldest first
    popular: { views: -1 },      // Most viewed first
    liked: { 'likes.length': -1 }, // Most liked
  }
  const sort = sortOptions[req.query.sort] || sortOptions.latest

  // Execute query with pagination
  // .populate() replaces author ObjectId with actual user data
  const [posts, totalPosts] = await Promise.all([
    Post.find(query)
      .populate('author', 'name avatar bio')  // Only fetch these fields from User
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('-content'),  // Exclude full content in listing (send in detail only)

    Post.countDocuments(query),  // Total count for pagination metadata
  ])

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalPosts / limit)

  res.json({
    success: true,
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  })
}

// ─────────────────────────────────────────────
// @route   GET /api/posts/:slug
// @access  Public
// ─────────────────────────────────────────────
export const getPostBySlug = async (req, res) => {
  // findOneAndUpdate atomically: find by slug AND increment views
  // This ensures every GET triggers a view count increment
  const post = await Post.findOneAndUpdate(
    { slug: req.params.slug, status: 'published' },
    { $inc: { views: 1 } },  // $inc = MongoDB increment operator
    { new: true }             // Return updated document
  )
    .populate('author', 'name avatar bio')
    .populate('comments.user', 'name avatar')  // Populate nested comment authors

  if (!post) {
    res.status(404)
    throw new Error('Post not found')
  }

  res.json({ success: true, post })
}

// ─────────────────────────────────────────────
// @route   POST /api/posts
// @access  Private (auth required)
// ─────────────────────────────────────────────
export const createPost = async (req, res) => {
  const { title, content, category, tags, coverImage, status, excerpt } = req.body

  const post = await Post.create({
    title,
    content,
    category,
    tags: tags || [],
    coverImage: coverImage || '',
    excerpt,
    status: status || 'draft',
    author: req.user._id,  // From protect middleware
  })

  // Populate author before sending response
  await post.populate('author', 'name avatar')

  res.status(201).json({ success: true, post })
}

// ─────────────────────────────────────────────
// @route   PUT /api/posts/:id
// @access  Private (owner or admin)
// ─────────────────────────────────────────────
export const updatePost = async (req, res) => {
  const { title, content, category, tags, coverImage, status, excerpt } = req.body

  // req.document was attached by ownerOrAdmin middleware
  // So we know this user is authorized to edit this post
  const post = req.document

  // Only update fields that were actually sent
  if (title) post.title = title
  if (content) post.content = content
  if (category) post.category = category
  if (tags) post.tags = tags
  if (coverImage !== undefined) post.coverImage = coverImage
  if (status) post.status = status
  if (excerpt) post.excerpt = excerpt

  await post.save()  // Triggers pre-save hooks (slug regeneration, read time calc)
  await post.populate('author', 'name avatar')

  res.json({ success: true, post })
}

// ─────────────────────────────────────────────
// @route   DELETE /api/posts/:id
// @access  Private (owner or admin)
// ─────────────────────────────────────────────
export const deletePost = async (req, res) => {
  await req.document.deleteOne()

  res.json({ success: true, message: 'Post deleted successfully' })
}

// ─────────────────────────────────────────────
// @route   PUT /api/posts/:id/like
// @access  Private
// ─────────────────────────────────────────────
export const toggleLike = async (req, res) => {
  const post = await Post.findById(req.params.id)

  if (!post) {
    res.status(404)
    throw new Error('Post not found')
  }

  const userId = req.user._id
  const isLiked = post.likes.includes(userId)

  if (isLiked) {
    // $pull = remove from array
    await Post.findByIdAndUpdate(req.params.id, { $pull: { likes: userId } })
  } else {
    // $addToSet = add to array only if not already present (prevents duplicates)
    await Post.findByIdAndUpdate(req.params.id, { $addToSet: { likes: userId } })
  }

  res.json({
    success: true,
    liked: !isLiked,
    likeCount: isLiked ? post.likes.length - 1 : post.likes.length + 1,
  })
}

// ─────────────────────────────────────────────
// @route   POST /api/posts/:id/comments
// @access  Private
// ─────────────────────────────────────────────
export const addComment = async (req, res) => {
  const { content } = req.body

  if (!content?.trim()) {
    res.status(400)
    throw new Error('Comment cannot be empty')
  }

  const post = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $push: {   // $push = add to array
        comments: {
          user: req.user._id,
          content: content.trim(),
        }
      }
    },
    { new: true }
  ).populate('comments.user', 'name avatar')

  if (!post) {
    res.status(404)
    throw new Error('Post not found')
  }

  // Return only the newly added comment
  const newComment = post.comments[post.comments.length - 1]

  res.status(201).json({ success: true, comment: newComment })
}