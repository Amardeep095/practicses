// components/BlogCard.jsx

// This is a SERVER component (no 'use client') — pure display, no interactivity
import Link from 'next/link'
import { format } from 'date-fns'  // For clean date formatting

export default function BlogCard({ post }) {
  // post = { slug, title, description, date, author, tags, readingTime }

  // Format date: "2024-12-15" → "December 15, 2024"
  const formattedDate = format(new Date(post.date), 'MMMM d, yyyy')

  return (
    // The entire card is a link to the blog post
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="
        bg-white rounded-2xl p-6 border border-gray-100
        shadow-sm hover:shadow-md hover:-translate-y-1
        transition-all duration-300 ease-out
        group-hover:border-blue-100
      ">
        
        {/* Tags Row */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="
          text-xl font-bold text-gray-900 mb-2
          group-hover:text-blue-600 transition-colors
          leading-snug
        ">
          {post.title}
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {post.description}
        </p>

        {/* Footer: Author + Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            {/* Author Avatar — initials based */}
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
              {post.author?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-600">{post.author}</span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{formattedDate}</span>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>
        </div>

      </article>
    </Link>
  )
}