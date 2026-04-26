---
title: "MERN to Next.js — A Developer's Transition Guide"
description: "Already know MERN? Here's exactly how Next.js maps to what you already know."
date: "2024-12-15"
author: "Amardeep Singh"
tags: ["mern", "nextjs", "javascript"]
---

## Your MERN Knowledge Translates

If you know MERN, you're closer to Next.js than you think.

## The Mental Model Shift

| MERN | Next.js Equivalent |
|---|---|
| Express routes | API Routes in `app/api/` |
| React frontend | Still React — same components |
| `useEffect` + fetch | Server Components (no useEffect needed) |
| Separate frontend/backend repos | One unified Next.js project |

## What You Stop Doing

- No more CORS configuration
- No more separate frontend/backend deploys
- No more `proxy` in package.json

## What You Start Doing

- Think in terms of **Server vs Client components**
- Use **file-based routing** instead of React Router
- Fetch data **at build time** when possible

## A Real Example

**MERN way (Express + React):**
```js
// Express backend
app.get('/api/posts', async (req, res) => {
  const posts = await Post.find()
  res.json(posts)
})

// React frontend
useEffect(() => {
  fetch('/api/posts').then(r => r.json()).then(setPosts)
}, [])
```

**Next.js way:**
```js
// One file, no API needed for static data
async function HomePage() {
  const posts = await getPosts() // runs on server!
  return <PostList posts={posts} />
}
```

Much cleaner.