import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

// ── Navbar ────────────────────────────────────
function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-gray-900 tracking-tight">
          ✍️ DevBlog
        </Link>
        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-500">Hi, {user?.name}</span>
              <Link
                to="/create"
                className="text-sm bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition"
              >
                Write
              </Link>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-900 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 transition">
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

// ── Blog Card ─────────────────────────────────
function BlogCard({ post, index }) {
  const categories = {
    Technology: 'bg-blue-50 text-blue-600',
    Programming: 'bg-purple-50 text-purple-600',
    Design: 'bg-pink-50 text-pink-600',
    Career: 'bg-green-50 text-green-600',
    Tutorial: 'bg-amber-50 text-amber-600',
    Other: 'bg-gray-50 text-gray-600',
  }

  return (
    // staggered fade-in: each card delays by index * 0.1s
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link to={`/blog/${post.slug}`} className="group block">
        <article className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300">

          {/* Category badge */}
          <div className="mb-3">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${categories[post.category] || categories.Other}`}>
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                {post.author?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs text-gray-500">{post.author?.name}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{post.readTime} min read</span>
              <span>·</span>
              <span>{post.likes?.length || 0} likes</span>
            </div>
          </div>

        </article>
      </Link>
    </motion.div>
  )
}

// ── Skeleton Card (loading state) ─────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
      <div className="h-5 w-24 bg-gray-100 rounded-full mb-3" />
      <div className="h-5 w-full bg-gray-100 rounded mb-2" />
      <div className="h-5 w-3/4 bg-gray-100 rounded mb-4" />
      <div className="h-4 w-full bg-gray-50 rounded mb-2" />
      <div className="h-4 w-5/6 bg-gray-50 rounded mb-4" />
      <div className="flex justify-between pt-4 border-t border-gray-50">
        <div className="h-4 w-24 bg-gray-100 rounded" />
        <div className="h-4 w-20 bg-gray-100 rounded" />
      </div>
    </div>
  )
}

// ── CATEGORIES ────────────────────────────────
const CATEGORIES = ['All', 'Technology', 'Programming', 'Design', 'Career', 'Tutorial']

// ── DUMMY DATA (until backend is connected) ───
const DUMMY_POSTS = [
  {
    _id: '1', slug: 'mern-to-nextjs', title: 'MERN to Next.js — A Developer\'s Transition Guide',
    excerpt: 'Already know MERN? Here\'s exactly how Next.js maps to what you already know. A practical migration path with real code examples.',
    category: 'Programming', tags: ['mern', 'nextjs', 'react'],
    author: { name: 'Amardeep Kumar' }, readTime: 5, likes: [{}, {}, {}],
    createdAt: new Date().toISOString()
  },
  {
    _id: '2', slug: 'jwt-auth-deep-dive', title: 'JWT Authentication Deep Dive — From Scratch',
    excerpt: 'Build a complete auth system with refresh tokens, blacklisting, and secure storage patterns that hold up in production.',
    category: 'Tutorial', tags: ['security', 'jwt', 'nodejs'],
    author: { name: 'Amardeep Kumar' }, readTime: 8, likes: [{}, {}],
    createdAt: new Date().toISOString()
  },
  {
    _id: '3', slug: 'mongodb-schema-design', title: 'MongoDB Schema Design for Scale',
    excerpt: 'Learn the patterns that separate junior and senior MongoDB developers. Embedding vs referencing — when to use which.',
    category: 'Technology', tags: ['mongodb', 'database'],
    author: { name: 'Amardeep Kumar' }, readTime: 6, likes: [{}],
    createdAt: new Date().toISOString()
  },
  {
    _id: '4', slug: 'tailwind-tips', title: 'Tailwind CSS Tips Every Developer Should Know',
    excerpt: 'Stop writing custom CSS for everything. These Tailwind patterns will 10x your UI development speed.',
    category: 'Design', tags: ['tailwind', 'css', 'ui'],
    author: { name: 'Amardeep Kumar' }, readTime: 4, likes: [{}, {}, {}, {}],
    createdAt: new Date().toISOString()
  },
  {
    _id: '5', slug: 'nodejs-best-practices', title: 'Node.js Production Best Practices in 2024',
    excerpt: 'From error handling to security headers — everything you need before shipping a Node.js app to production.',
    category: 'Programming', tags: ['nodejs', 'backend'],
    author: { name: 'Amardeep Kumar' }, readTime: 7, likes: [{}, {}],
    createdAt: new Date().toISOString()
  },
  {
    _id: '6', slug: 'react-performance', title: 'React Performance Optimization — The Complete Guide',
    excerpt: 'useMemo, useCallback, lazy loading, code splitting — when to actually use them and when they hurt more than help.',
    category: 'Tutorial', tags: ['react', 'performance'],
    author: { name: 'Amardeep Kumar' }, readTime: 9, likes: [{}, {}, {}],
    createdAt: new Date().toISOString()
  },
]

// ── HOME PAGE ─────────────────────────────────
export default function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    // Simulate API call — replace with real API later:
    // const data = await postService.getAll({ category, search })
    const timer = setTimeout(() => {
      setPosts(DUMMY_POSTS)
      setLoading(false)
    }, 800)  // 800ms fake loading so you can see the skeleton
    return () => clearTimeout(timer)
  }, [])

  // Filter posts client-side on dummy data
  // When you connect real API, move filtering to query params
  const filtered = posts.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.excerpt.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium mb-5 bg-blue-50 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              New posts every week
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
              Thoughts on{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                Full Stack Dev
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
              Real-world tutorials, project breakdowns, and lessons from building production apps.
            </p>

            {/* Search bar */}
            <div className="max-w-md mx-auto relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Category filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts count */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            {activeCategory === 'All' ? 'Latest Posts' : activeCategory}
          </h2>
          <span className="text-sm text-gray-400">
            {loading ? '...' : `${filtered.length} articles`}
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-400">No posts found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <BlogCard key={post._id} post={post} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}