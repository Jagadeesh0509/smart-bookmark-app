# Smart Bookmark App

### LIVE ###

https://smart-bookmark-app-lac-psi.vercel.app/


A modern bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

✅ Google OAuth Authentication  
✅ Private Bookmarks  
✅ Real-time Updates (Supabase Realtime)  
✅ Easy Management  

## Tech Stack

- Next.js 16+ (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- Vercel Deployment

## Problems & Solutions

### 1. Component Props Mismatch
Fixed by creating proper component implementations with correct TypeScript types.

### 2. React Hook Warnings
Moved `fetchBookmarks()` inside useEffect and fixed dependency array.

### 3. Real-time Updates
Implemented Supabase Realtime subscriptions with PostgreSQL change listeners.

### 4. Google OAuth
Created OAuth callback handler at `/app/auth/callback/route.ts`.

### 5. Bookmark Privacy
Implemented RLS policies to restrict access to own bookmarks only.

### 6. Port Conflicts
Killed existing Node processes and removed `.next/dev/lock`.

### 7. OAuth Callback
Created proper handler to exchange auth code for session.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
