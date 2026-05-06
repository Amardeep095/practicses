// components/Footer.jsx

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-gray-100 bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="text-sm text-gray-400">
          © {currentYear} <span className="text-gray-600 font-medium">DevBlog</span>. 
          Built with Next.js & Tailwind.
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition-colors"
          >
            GitHub
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-gray-700 transition-colors"
          >
            Twitter
          </a>
        </div>

      </div>
    </footer>
  )
}