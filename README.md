# 💘 Crush Application Portal

A very serious website where people can formally apply to be your crush.

## Stack

- **Next.js 14** (App Router)
- **Supabase** (database for storing applications)
- **Vercel** (hosting)

---

## Setup Guide

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free project
2. Go to the **SQL Editor** in your Supabase dashboard
3. Paste and run the contents of `supabase-schema.sql` to create the table
4. Go to **Settings → API** and copy:
   - **Project URL**
   - **anon public** key

### 2. Configure environment variables

Copy the example file:
```bash
cp .env.example .env.local
```

Fill in your Supabase values in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push this project to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. In the Vercel project settings, add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy! 🚀

---

## Viewing Applications

Applications are stored in the `crush_applications` table in Supabase.

To view them, go to your Supabase dashboard → **Table Editor** → `crush_applications`.

Each application includes:
- Name, age, vibe
- Best quality & red flags
- Rizz sample 😂
- Love language
- Self-rating
- Why they should be your crush
- Timestamp

---

## Customization Tips

- Edit the hero copy in `app/page.tsx` to personalize the site
- Add your name to the title in `app/layout.tsx`
- Change the acceptance rate stat (currently 0%, very accurate)
- Add more vibe/love language options in the dropdowns
