// components/Navbar.jsx

// "use client" tells Next.js: "This component uses browser features"
// We need it here because we want to show the current active link
'use client'

import Link from 'next/link'       // Next.js smart link — prefetches pages
import { usePathname } from 'next/navigation'  // Tells us the current URL path

export default function Navbar() {
  const pathname = usePathname()  // e.g. "/blog/hello-world"

  // Helper: is this link currently active?
  const isActive = (path) => pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo / Brand */}
        <Link 
          href="/" 
          className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
        >
          ✍️ DevBlog
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors ${
              isActive('/') 
                ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium transition-colors ${
              isActive('/about') 
                ? 'text-blue-600 border-b-2 border-blue-600 pb-0.5' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            About
          </Link>
        </div>
      </div>
    </nav>
  )
}