// lib/posts.js

import fs from 'fs'           // Node.js built-in: reads files from disk
import path from 'path'       // Node.js built-in: handles file paths safely
import matter from 'gray-matter'    // Parses frontmatter (the --- block)
import readingTime from 'reading-time'  // Calculates read time

// ─────────────────────────────────────────────
// 1. Define where our markdown files live
// ─────────────────────────────────────────────
// process.cwd() = root of your project
// path.join() safely connects path segments (handles / vs \ on different OSes)
const POSTS_DIR = path.join(process.cwd(), 'content')

// ─────────────────────────────────────────────
// 2. Get ALL posts (for the home page list)
// ─────────────────────────────────────────────
export function getAllPosts() {
  // Read all files in the content/ folder
  const fileNames = fs.readdirSync(POSTS_DIR)
  // fileNames = ['hello-world.md', 'nextjs-vs-react.md', ...]

  const posts = fileNames
    .filter(file => file.endsWith('.md'))  // Only process .md files
    .map(fileName => {
      // Remove the .md extension to get the slug
      // 'hello-world.md' → 'hello-world'
      const slug = fileName.replace(/\.md$/, '')

      // Read the full file content as a string
      const fullPath = path.join(POSTS_DIR, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // gray-matter splits the file into:
      // data = the frontmatter object { title, date, author, ... }
      // content = everything after the --- block
      const { data, content } = matter(fileContents)

      // Calculate reading time from content
      const stats = readingTime(content)

      // Return a clean post object (no raw markdown content here — that's heavy)
      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        author: data.author,
        tags: data.tags || [],
        readingTime: stats.text,  // e.g. "4 min read"
      }
    })

  // Sort posts by date — newest first
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date))
}

// ─────────────────────────────────────────────
// 3. Get ONE post by slug (for the detail page)
// ─────────────────────────────────────────────
export function getPostBySlug(slug) {
  const fullPath = path.join(POSTS_DIR, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  const { data, content } = matter(fileContents)
  const stats = readingTime(content)

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author,
    tags: data.tags || [],
    readingTime: stats.text,
    content,  // ← We include raw content here for rendering
  }
}

// ─────────────────────────────────────────────
// 4. Get all slugs (for static path generation)
// ─────────────────────────────────────────────
export function getAllSlugs() {
  const fileNames = fs.readdirSync(POSTS_DIR)
  return fileNames
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''))
}