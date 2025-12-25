# 🚀 Vercel Deployment Guide for FinTrack (with Supabase Database)

## ✅ Prerequisites

Before deploying to Vercel, ensure:
- ✅ All code is committed and pushed to GitHub
- ✅ You have a Vercel account
- ✅ Your repository is connected to Vercel
- ✅ You have a Supabase account (free tier available)

---

## 🗄️ Step 1: Set Up Supabase Database (REQUIRED)

### Why Supabase?
- ✅ **Free tier** - 500MB database, perfect for this app
- ✅ **PostgreSQL** - Works perfectly with Vercel
- ✅ **Full CRUD** - Add, edit, delete transactions work perfectly
- ✅ **Persistent data** - Data doesn't reset on deployment

### Create Supabase Project:

1. **Go to Supabase:** https://supabase.com
2. **Sign up/Login** with GitHub
3. **Click "New Project"**
4. **Fill in details:**
   - **Name:** `fin-track` or any name you like
   - **Database Password:** Create a strong password (SAVE THIS!)
   - **Region:** Choose closest to you
   - **Plan:** Free (perfect for this app)
5. **Click "Create new project"**
6. **Wait 2-3 minutes** for setup to complete

### Get Connection String:

1. In your Supabase project dashboard
2. Go to **Settings** (gear icon) → **Database**
3. Scroll to **Connection string**
4. Select **URI** tab
5. Copy the connection string - it looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
6. **Replace `[YOUR-PASSWORD]`** with the password you created
7. **SAVE THIS STRING** - you'll need it!

---

## 🔧 Step 2: Update Prisma Schema

Update your `prisma/schema.prisma` file to use PostgreSQL:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model Category {
  id           String        @id @default(cuid())
  name         String        @unique
  icon         String
  color        String
  type         CategoryType
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  transactions Transaction[]
}

model Transaction {
  id          String          @id @default(cuid())
  amount      Float
  description String
  date        DateTime
  type        TransactionType
  categoryId  String
  category    Category        @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}

enum TransactionType {
  INCOME
  EXPENSE
}

enum CategoryType {
  INCOME
  EXPENSE
}
```

**Key changes:**
- Changed `provider = "sqlite"` → `provider = "postgresql"`
- Changed `url = "file:./dev.db"` → `url = env("DATABASE_URL")`
- Added `directUrl = env("DIRECT_URL")`

---

## ⚙️ Step 3: Configure Environment Variables

### On Vercel (Production):

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables:

**Variable 1:**
- **Key:** `DATABASE_URL`
- **Value:** Your Supabase connection string with `?pgbouncer=true` at the end
  ```
  postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true
  ```
- **Environments:** Production, Preview, Development

**Variable 2:**
- **Key:** `DIRECT_URL`
- **Value:** Your Supabase connection string WITHOUT `?pgbouncer=true`
  ```
  postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
  ```
- **Environments:** Production, Preview, Development

### Locally (.env file):

Create or update `.env` in your project root:

```env
# .env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres"
```

**Important:** Replace `[YOUR-PASSWORD]` and `xxxxx` with your actual values!

---

## 🔨 Step 4: Initialize Database Locally

Run these commands in your terminal:

```bash
cd "/Users/sopheappit/Desktop/Intensive Internship/fin-track"

# Generate Prisma Client with new PostgreSQL schema
npx prisma generate

# Push schema to Supabase database
npx prisma db push

# Seed the database with categories and sample data
npm run db:seed
```

**Expected output:**
```
✓ Generated Prisma Client
✓ Your database is now in sync with your schema
✓ Database seeded successfully!
```

---

## 🔧 Step 5: Fix Prisma Build Issue (Already Done)

### Problem
Vercel caches dependencies, which prevents Prisma Client from being generated automatically.

### Solution: ✅ ALREADY FIXED!

Added `postinstall` script to `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    // ...other scripts
  }
}
```

This automatically generates Prisma Client after npm install on Vercel.

---

## 📝 Step 6: Configure Vercel Project

### Option A: Deploy via Vercel Dashboard

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Click "Add New Project"**
3. **Import your GitHub repository:** `Chhay-Lyhour/fin-track`
4. **Configure Build Settings:**
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel
```

---

## 🚀 Step 7: Deploy!

### Commit and Push Changes

```bash
git add .
git commit -m "Migrate to Supabase PostgreSQL database for production"
git push origin main
```

Vercel will automatically:
1. ✅ Detect the push
2. ✅ Install dependencies
3. ✅ Run `postinstall` (generates Prisma Client)
4. ✅ Connect to Supabase database
5. ✅ Build the Next.js app
6. ✅ Deploy to production

---

## ✅ Verification

After deployment, test on your live Vercel URL:

### Test All Operations:

1. ✅ **Add Transaction** - Should save to Supabase
2. ✅ **Edit Transaction** - Should update in Supabase
3. ✅ **Delete Transaction** - Should remove from Supabase
4. ✅ **Refresh Page** - Data persists (doesn't disappear!)
5. ✅ **Redeploy** - Data still there (doesn't reset!)

### Check Supabase:

1. Go to your Supabase project
2. Click **Table Editor**
3. You should see your tables: `Category` and `Transaction`
4. Click on tables to view data

---

## 🐛 Troubleshooting

### Issue: "Can't reach database server"

**Possible causes:**
1. Wrong connection string
2. Wrong password in connection string
3. Missing `?pgbouncer=true` in DATABASE_URL

**Fix:**
- Double-check your connection string
- Verify password is correct
- Ensure environment variables are set in Vercel

### Issue: "SSL connection error"

**Fix:** Add `?sslmode=require` to connection strings:
```
postgresql://...?pgbouncer=true&sslmode=require
```

### Issue: "Prepared statement already exists"

**Fix:** This is why we use `directUrl` - it's already configured correctly!

### Issue: Build succeeds but no data

**Fix:** Run `npm run db:seed` locally to populate the database

---

## 📊 Current Configuration

```json
// package.json
{
  "scripts": {
    "postinstall": "prisma generate", // ✅ Generates Prisma Client
    "build": "next build",             // ✅ Builds Next.js
    "start": "next start",             // ✅ Starts production server
    "db:seed": "tsx prisma/seed.ts"    // ✅ Seeds database
  }
}
```

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider  = "postgresql"              // ✅ PostgreSQL for Supabase
  url       = env("DATABASE_URL")       // ✅ Pooled connection
  directUrl = env("DIRECT_URL")         // ✅ Direct connection for migrations
}
```

---

## 🎯 Deployment Checklist

Before deploying, ensure:

- ✅ Created Supabase project
- ✅ Got connection string from Supabase
- ✅ Updated `prisma/schema.prisma` to PostgreSQL
- ✅ Added `DATABASE_URL` to Vercel environment variables
- ✅ Added `DIRECT_URL` to Vercel environment variables
- ✅ Updated local `.env` file
- ✅ Ran `npx prisma db push`
- ✅ Ran `npm run db:seed`
- ✅ All TypeScript errors are fixed
- ✅ Local build succeeds (`npm run build`)
- ✅ All changes are committed and pushed

---

## 🎉 Success!

Once deployed, your FinTrack app will be live with:

✅ **Full Database Functionality:**
- Add transactions ✅
- Edit transactions ✅
- Delete transactions ✅
- Data persists across deployments ✅
- No data loss on redeploy ✅

✅ **Features Working:**
- Beautiful light mode UI
- Interactive charts
- Real-time statistics
- Fully responsive design

---

## 📝 Database Comparison

### Before (SQLite):
```
Localhost: ✅ Full CRUD works
Vercel:    ❌ READ-ONLY (no write/update/delete)
Data:      ❌ Resets on each deployment
```

### After (Supabase PostgreSQL):
```
Localhost: ✅ Full CRUD works
Vercel:    ✅ Full CRUD works
Data:      ✅ Persists forever
```

---

## 🆘 Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **Prisma with Supabase:** https://supabase.com/docs/guides/getting-started/quickstarts/prisma
- **Vercel Docs:** https://vercel.com/docs
- **Prisma on Vercel:** https://pris.ly/d/vercel-build

---

## ✅ Summary

**Status:** 🟢 Ready to Deploy with Supabase!

**Setup:**
- ✅ Supabase PostgreSQL database
- ✅ Prisma Client generation with `postinstall`
- ✅ All TypeScript errors fixed
- ✅ Full CRUD operations working
- ✅ Persistent data storage

**Your FinTrack app is production-ready with a real database!** 🚀
