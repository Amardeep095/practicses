// app/page.jsx

// ⚡ This is a SERVER COMPONENT by default
// It runs on the server — can directly call file system functions
// No useEffect, no fetch() to an API — just direct data access

import { getAllPosts } from '@/lib/posts'
import BlogCard from '@/components/BlogCard'

// Page-level metadata — "Home | DevBlog" in browser tab
export const metadata = {
  title: 'Home',
  description: 'Explore articles on full stack development, Next.js, MERN and more.',
}

export default function HomePage() {
  // ✅ This runs ON THE SERVER at build time (SSG)
  // When you run `npm run build`, Next.js calls this function,
  // gets all posts, and generates a static HTML file
  // No database call on every user visit!
  const posts = getAllPosts()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium mb-4 bg-blue-50 px-4 py-1.5 rounded-full">
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          New posts every week
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          Thoughts on{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
            Full Stack Dev
          </span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Real-world tutorials, project breakdowns, and lessons from building production apps.
        </p>
      </div>

      {/* Posts Section */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900">
            Latest Posts
          </h2>
          <span className="text-sm text-gray-400">
            {posts.length} {posts.length === 1 ? 'article' : 'articles'}
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-lg">No posts yet. Check back soon!</p>
          </div>
        ) : (
          // CSS Grid: 1 column on mobile, 2 on tablet+
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {posts.map(post => (
              // Each BlogCard gets the full post object
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}