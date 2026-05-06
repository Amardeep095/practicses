---
title: "Next.js vs React — What's Actually Different?"
description: "You know React. But what does Next.js actually add? Let's break it down with real examples."
date: "2024-12-10"
author: "Amardeep Singh"
tags: ["nextjs", "react", "webdev"]
---

## The Core Difference

React is a **UI library**. It runs entirely in the browser.

Next.js is a **framework built on top of React** that can run code on the server too.

## Rendering Strategies

### Static Site Generation (SSG)
Pages are built at **compile time**. Super fast, great for blogs.

```js
// This runs at BUILD TIME, not when user visits
export async function generateStaticParams() {
  return posts.map(post => ({ slug: post.slug }))
}
```

### Server Side Rendering (SSR)
Pages are built on the **server for each request**. Great for dashboards.

### Client Side Rendering (CSR)
The old React way — browser fetches data and renders. Fine for dynamic UIs.

## Which Should You Use?

| Use Case | Strategy |
|---|---|
| Blog, docs, marketing | SSG |
| User dashboard | SSR or CSR |
| Real-time data | CSR |

## Conclusion

Next.js doesn't replace React. It **supercharges** it.