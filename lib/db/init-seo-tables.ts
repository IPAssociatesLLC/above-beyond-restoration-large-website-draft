import { pool } from './index'

let initialized = false

export async function ensureSeoTablesExist() {
  if (initialized) return
  if (!process.env.DATABASE_URL) return

  try {
    const client = await pool.connect()
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "seo_content_schedule" (
          "id" SERIAL PRIMARY KEY,
          "dayNumber" INTEGER NOT NULL UNIQUE,
          "theme" TEXT NOT NULL,
          "targetCity" TEXT NOT NULL,
          "pageKeywords" JSONB NOT NULL DEFAULT '[]'::jsonb,
          "blogKeyword" TEXT NOT NULL,
          "blogTitle" TEXT,
          "status" TEXT NOT NULL DEFAULT 'pending',
          "generatedAt" TIMESTAMP,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "seo_pages" (
          "id" SERIAL PRIMARY KEY,
          "slug" TEXT NOT NULL UNIQUE,
          "title" TEXT NOT NULL,
          "subtitle" TEXT NOT NULL,
          "heroImage" TEXT NOT NULL DEFAULT '/images/water-damage.png',
          "keyword" TEXT NOT NULL,
          "city" TEXT NOT NULL,
          "serviceCategory" TEXT NOT NULL,
          "description" JSONB NOT NULL DEFAULT '[]'::jsonb,
          "benefits" JSONB NOT NULL DEFAULT '[]'::jsonb,
          "process" JSONB NOT NULL DEFAULT '[]'::jsonb,
          "faqs" JSONB NOT NULL DEFAULT '[]'::jsonb,
          "relatedServices" JSONB NOT NULL DEFAULT '[]'::jsonb,
          "metaTitle" TEXT NOT NULL,
          "metaDescription" TEXT NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'published',
          "dayNumber" INTEGER,
          "publishedAt" TIMESTAMP DEFAULT NOW(),
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS "blog_posts" (
          "id" SERIAL PRIMARY KEY,
          "slug" TEXT NOT NULL UNIQUE,
          "title" TEXT NOT NULL,
          "excerpt" TEXT NOT NULL,
          "content" TEXT NOT NULL,
          "heroImage" TEXT NOT NULL DEFAULT '/images/why-choose-us-team.png',
          "category" TEXT NOT NULL DEFAULT 'Water Damage & Restoration',
          "keyword" TEXT NOT NULL,
          "author" TEXT NOT NULL DEFAULT 'Above & Beyond Restoration Team',
          "readTime" TEXT NOT NULL DEFAULT '5 min read',
          "faqs" JSONB NOT NULL DEFAULT '[]'::jsonb,
          "metaTitle" TEXT NOT NULL,
          "metaDescription" TEXT NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'published',
          "dayNumber" INTEGER,
          "publishedAt" TIMESTAMP DEFAULT NOW(),
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `)
      initialized = true
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Failed to auto-create SEO tables in postgres:', err)
  }
}
