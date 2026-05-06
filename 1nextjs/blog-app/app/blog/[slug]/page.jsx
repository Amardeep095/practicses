// app/blog/[slug]/page.jsx

import { getPostBySlug, getAllSlugs } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'  // Renders markdown → HTML
import { format } from 'date-fns'
import { notFound } from 'next/navigation'  // Next.js 404 utility

// ─────────────────────────────────────────────
// generateStaticParams = the App Router version of getStaticPaths
// It tells Next.js: "Here are ALL the slugs that exist"
// Next.js pre-builds a page for each one at build time
// ─────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = getAllSlugs()
  // Must return array of objects matching the [slug] param name
  // [{ slug: 'hello-world' }, { slug: 'nextjs-vs-react' }, ...]
  return slugs.map(slug => ({ slug }))
}

// ─────────────────────────────────────────────
// generateMetadata = dynamic SEO per page
// Next.js calls this to build the <head> for each post
// ─────────────────────────────────────────────
export async function generateMetadata({ params }) {
  // params.slug = the [slug] part from the URL
  // e.g. visiting /blog/hello-world → params = { slug: 'hello-world' }
  const post = getPostBySlug(params.slug)
  
  if (!post) return { title: 'Post Not Found' }

  return {
    title: post.title,                    // → "Hello World | DevBlog"
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

// ─────────────────────────────────────────────
// Custom components for MDX rendering
// You can override any HTML element with your own styled version
// ─────────────────────────────────────────────
const mdxComponents = {
  // Every <h2> in markdown gets this styling
  h2: ({ children }) => (
    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3">{children}</h3>
  ),
  // Every paragraph
  p: ({ children }) => (
    <p className="text-gray-600 leading-relaxed mb-5">{children}</p>
  ),
  // Inline code
  code: ({ children }) => (
    <code className="bg-gray-100 text-blue-600 px-1.5 py-0.5 rounded text-sm font-mono">
      {children}
    </code>
  ),
  // Code blocks
  pre: ({ children }) => (
    <pre className="bg-gray-900 text-gray-100 rounded-xl p-5 overflow-x-auto my-6 text-sm leading-relaxed">
      {children}
    </pre>
  ),
  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-400 pl-5 py-1 my-6 text-gray-500 italic">
      {children}
    </blockquote>
  ),
  // Unordered lists
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-2 mb-5 text-gray-600">{children}</ul>
  ),
  // Links
  a: ({ href, children }) => (
    <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
}

// ─────────────────────────────────────────────
// The actual Page component
// ─────────────────────────────────────────────
export default function BlogPostPage({ params }) {
  // params.slug comes from the URL: /blog/hello-world → { slug: 'hello-world' }
  const post = getPostBySlug(params.slug)

  // If no markdown file found for this slug, show 404
  if (!post) notFound()

  const formattedDate = format(new Date(post.date), 'MMMM d, yyyy')

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      
      {/* Back Link */}
      <a 
        href="/" 
        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 mb-10 transition-colors"
      >
        ← Back to all posts
      </a>

      {/* Post Header */}
      <header className="mb-10">
        
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-5">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 py-4 border-y border-gray-100">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center">
            {post.author?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{post.author}</p>
            <p className="text-xs text-gray-400">{formattedDate} · {post.readingTime}</p>
          </div>
        </div>

      </header>

      {/* Article Body — MDXRemote renders markdown to styled HTML */}
      <article className="prose-sm">
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>

      {/* Post Footer */}
      <footer className="mt-16 pt-8 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm mb-4">Thanks for reading!</p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Read more posts →
        </a>
      </footer>

    </div>
  )
}