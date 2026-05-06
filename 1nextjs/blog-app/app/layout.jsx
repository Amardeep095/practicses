// app/layout.jsx

import { Inter } from 'next/font/google'  // Zero-layout-shift font loading
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import './globals.css'

// Load Inter font — Next.js handles optimization automatically
const inter = Inter({ subsets: ['latin'] })

// export metadata = Next.js SEO system (replaces <head> tags)
export const metadata = {
  title: {
    // %s = the specific page title, filled in by individual pages
    // e.g. "Hello World | DevBlog"
    template: '%s | DevBlog',
    default: 'DevBlog — Developer Thoughts',
  },
  description: 'A blog about full stack development, MERN, Next.js, and building real-world projects.',
  // Open Graph = how your page looks when shared on Twitter, LinkedIn, WhatsApp
  openGraph: {
    title: 'DevBlog',
    description: 'Full stack development insights and tutorials.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* inter.className applies the loaded font to all text */}
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen flex flex-col`}>
        <Navbar />
        {/* 
          children = whatever page.jsx is currently matched by the URL
          This is React's composition model — layout wraps the page 
        */}
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}