import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

// ── Dummy data (same slugs as HomePage) ───────
const DUMMY_POSTS = {
  'mern-to-nextjs': {
    _id: '1',
    slug: 'mern-to-nextjs',
    title: "MERN to Next.js — A Developer's Transition Guide",
    excerpt: 'Already know MERN? Here\'s exactly how Next.js maps to what you already know.',
    category: 'Programming',
    tags: ['mern', 'nextjs', 'react'],
    author: { name: 'Amardeep Kumar', bio: 'Full Stack Developer & B.Tech CSE Final Year' },
    readTime: 5,
    views: 342,
    likes: ['u1', 'u2', 'u3'],
    comments: [
      { _id: 'c1', user: { name: 'Rohan Kumar' }, content: 'Really well explained! The slug generation using pre-save hook was something I hadn\'t thought of before.', createdAt: new Date().toISOString() },
      { _id: 'c2', user: { name: 'Priya Sharma' }, content: 'The ownerOrAdmin middleware pattern is gold. Going to use this in my project!', createdAt: new Date().toISOString() },
    ],
    createdAt: new Date().toISOString(),
    content: `
## Why Transition from MERN to Next.js?

If you know MERN, you're closer to Next.js than you think. The mental model shifts from maintaining separate frontend and backend repos to a single unified framework.

## The Key Differences

Express routes become **API Routes** inside \`app/api/\`. Your React components stay the same, but you gain Server Components that can fetch data without \`useEffect\`.

## What You Stop Doing

- No more CORS configuration
- No more separate frontend/backend deploys  
- No more \`proxy\` in package.json
- No more \`useEffect\` just to fetch initial data

## A Real Code Comparison

**MERN way:**

\`\`\`javascript
// Express backend
app.get('/api/posts', async (req, res) => {
  const posts = await Post.find()
  res.json(posts)
})

// React frontend
useEffect(() => {
  fetch('/api/posts').then(r => r.json()).then(setPosts)
}, [])
\`\`\`

**Next.js way:**

\`\`\`javascript
// One file — runs on server!
async function HomePage() {
  const posts = await getPosts()
  return <PostList posts={posts} />
}
\`\`\`

## Conclusion

Next.js doesn't replace React. It supercharges it. Your MERN knowledge is the perfect foundation.
    `,
  },
  'jwt-auth-deep-dive': {
    _id: '2',
    slug: 'jwt-auth-deep-dive',
    title: 'JWT Authentication Deep Dive — From Scratch',
    excerpt: 'Build a complete auth system with refresh tokens, blacklisting, and secure storage patterns.',
    category: 'Tutorial',
    tags: ['security', 'jwt', 'nodejs'],
    author: { name: 'Amardeep Kumar', bio: 'Full Stack Developer & B.Tech CSE Final Year' },
    readTime: 8,
    views: 215,
    likes: ['u1'],
    comments: [],
    createdAt: new Date().toISOString(),
    content: `
## What is JWT?

A JSON Web Token is a compact, self-contained way to securely transmit information between parties as a JSON object.

## The Three Parts

A JWT looks like this: \`xxxxx.yyyyy.zzzzz\`

- **Header** — algorithm & token type
- **Payload** — the data (user id, role, expiry)
- **Signature** — ensures the token wasn't tampered with

## Generating a Token

\`\`\`javascript
const token = jwt.sign(
  { id: user._id },         // Payload
  process.env.JWT_SECRET,   // Secret key
  { expiresIn: '7d' }       // Expiry
)
\`\`\`

## Verifying a Token

\`\`\`javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET)
// decoded = { id: "userId", iat: 1234567890, exp: 1234567890 }
\`\`\`

## Where to Store Tokens

- **localStorage** — easy but vulnerable to XSS attacks
- **httpOnly cookies** — safer for production, can't be accessed by JS
    `,
  },
  'mongodb-schema-design': {
    _id: '3',
    slug: 'mongodb-schema-design',
    title: 'MongoDB Schema Design for Scale',
    excerpt: 'Learn the patterns that separate junior and senior MongoDB developers.',
    category: 'Technology',
    tags: ['mongodb', 'database'],
    author: { name: 'Amardeep Kumar', bio: 'Full Stack Developer & B.Tech CSE Final Year' },
    readTime: 6,
    views: 189,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
    content: `
## Embed vs Reference — The Golden Rule

The most common mistake in MongoDB is treating it like a relational database.

**Embed when:**
- Data is always fetched together
- 1:few relationship (post → comments)
- Child data doesn't need to exist independently

**Reference when:**
- Data can exist independently
- 1:many or many:many relationship
- You need to query the child data directly

## Practical Example

\`\`\`javascript
// Embed — comments inside posts
comments: [{ user: ObjectId, content: String }]

// Reference — author of a post
author: { type: ObjectId, ref: 'User' }
\`\`\`

## Indexes Matter

\`\`\`javascript
// Text search index
postSchema.index({ title: 'text', content: 'text' })

// Compound index for common query pattern
postSchema.index({ category: 1, createdAt: -1 })
\`\`\`
    `,
  },
}

// ── Simple markdown renderer ───────────────────
function renderContent(content) {
  if (!content) return []

  return content.split('\n').map((line, i) => {
    // H2
    if (line.startsWith('## ')) {
      return (
        <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
          {line.replace('## ', '')}
        </h2>
      )
    }
    // H3
    if (line.startsWith('### ')) {
      return (
        <h3 key={i} className="text-xl font-semibold text-gray-800 mt-8 mb-3">
          {line.replace('### ', '')}
        </h3>
      )
    }
    // Code block start/end
    if (line.startsWith('```')) {
      return null
    }
    // Bullet points
    if (line.startsWith('- ')) {
      return (
        <li key={i} className="text-gray-600 ml-4 mb-1 list-disc">
          {line.replace('- ', '')}
        </li>
      )
    }
    // Empty line
    if (line.trim() === '') {
      return <div key={i} className="h-2" />
    }
    // Bold text (inline)
    const boldProcessed = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Inline code
    const codeProcessed = boldProcessed.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 text-blue-600 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
    )

    return (
      <p
        key={i}
        className="text-gray-600 leading-relaxed mb-3"
        dangerouslySetInnerHTML={{ __html: codeProcessed }}
      />
    )
  }).filter(Boolean)
}

// ── Comment Component ─────────────────────────
function Comment({ comment }) {
  return (
    <div className="flex gap-3 py-4 border-b border-gray-50">
      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
        {comment.user?.name?.charAt(0).toUpperCase()}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800 mb-1">{comment.user?.name}</p>
        <p className="text-sm text-gray-500 leading-relaxed">{comment.content}</p>
      </div>
    </div>
  )
}

// ── BLOG DETAIL PAGE ──────────────────────────
export default function BlogDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Simulate API fetch — replace with real API later:
    // const data = await postService.getBySlug(slug)
    const timer = setTimeout(() => {
      const found = DUMMY_POSTS[slug]
      if (!found) {
        navigate('/')
        return
      }
      setPost(found)
      setLikeCount(found.likes.length)
      setComments(found.comments)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [slug, navigate])

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.error('Please login to like posts')
      return
    }
    setLiked(prev => {
      setLikeCount(c => prev ? c - 1 : c + 1)
      return !prev
    })
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to comment')
      return
    }
    if (!comment.trim()) return

    setSubmitting(true)
    // Simulate API call — replace with: await postService.addComment(post._id, comment)
    setTimeout(() => {
      const newComment = {
        _id: Date.now().toString(),
        user: { name: user?.name || 'You' },
        content: comment.trim(),
        createdAt: new Date().toISOString(),
      }
      setComments(prev => [...prev, newComment])
      setComment('')
      setSubmitting(false)
      toast.success('Comment added!')
    }, 400)
  }

  // ── Skeleton loader ──
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
        <div className="h-4 w-20 bg-gray-200 rounded mb-8" />
        <div className="h-8 w-3/4 bg-gray-200 rounded mb-4" />
        <div className="h-8 w-1/2 bg-gray-200 rounded mb-8" />
        <div className="flex gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
          </div>
        </div>
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded mb-3" />
        ))}
      </div>
    )
  }

  if (!post) return null

  const categoryColors = {
    Technology: 'bg-blue-50 text-blue-600',
    Programming: 'bg-purple-50 text-purple-600',
    Design: 'bg-pink-50 text-pink-600',
    Career: 'bg-green-50 text-green-600',
    Tutorial: 'bg-amber-50 text-amber-600',
    Other: 'bg-gray-50 text-gray-600',
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">✍️ DevBlog</Link>
          <Link to="/" className="text-sm text-gray-500 hover:text-gray-900 transition">
            ← All posts
          </Link>
        </div>
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto px-4 py-12"
      >

        {/* ── Category + Tags ── */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${categoryColors[post.category]}`}>
            {post.category}
          </span>
          {post.tags?.map(tag => (
            <span key={tag} className="text-xs text-gray-400 bg-white border border-gray-100 px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* ── Title ── */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* ── Author + Meta ── */}
        <div className="flex items-center justify-between py-5 border-y border-gray-100 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
              {post.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{post.author?.name}</p>
              <p className="text-xs text-gray-400">{post.author?.bio}</p>
            </div>
          </div>
          <div className="text-right text-xs text-gray-400 space-y-1">
            <p>{post.readTime} min read</p>
            <p>{post.views} views</p>
          </div>
        </div>

        {/* ── Content ── */}
        <article className="mb-12">
          {renderContent(post.content)}
        </article>

        {/* ── Like + Share actions ── */}
        <div className="flex items-center gap-3 py-6 border-y border-gray-100 mb-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition ${
              liked
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            {liked ? '❤️' : '🤍'} {likeCount} likes
          </motion.button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-500 hover:border-gray-400 transition">
            💬 {comments.length} comments
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href)
              toast.success('Link copied!')
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-500 hover:border-gray-400 transition ml-auto"
          >
            🔗 Share
          </button>
        </div>

        {/* ── Comments ── */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h3>

          {/* Comment input */}
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder={isAuthenticated ? 'Write a comment...' : 'Login to comment...'}
              disabled={!isAuthenticated}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            <div className="flex justify-end mt-2">
              <motion.button
                type="submit"
                disabled={!isAuthenticated || submitting || !comment.trim()}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </motion.button>
            </div>
          </form>

          {/* Comments list */}
          {comments.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">
              No comments yet. Be the first!
            </p>
          ) : (
            <div>
              {comments.map(c => <Comment key={c._id} comment={c} />)}
            </div>
          )}
        </section>

      </motion.div>
    </div>
  )
}