// backend/src/config/env.ts
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: parseInt(process.env.PORT ?? '5000', 10),

  // Database
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT ?? '5432', 10),
  DB_NAME: process.env.DB_NAME ?? 'aquaglow_db',
  DB_USER: process.env.DB_USER ?? 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD ?? 'postgres',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET ?? 'your_jwt_secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY ?? '24h',

  // Email
  EMAIL_HOST: process.env.EMAIL_HOST ?? '',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT ?? '587', 10),
  EMAIL_USER: process.env.EMAIL_USER ?? '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ?? '',
  EMAIL_FROM: process.env.EMAIL_FROM ?? 'noreply@aquaglow.com',

  // Payment
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY ?? '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ?? '',

  // CORS / Frontend
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:3000',

  // AI
  GOOGLE_GEMINI_API_KEY: process.env.GOOGLE_GEMINI_API_KEY ?? '',

  // NEW: API base URL (for internal fetch clients, if you keep them)
  API_URL: process.env.API_URL ?? `http://localhost:${process.env.PORT ?? '5000'}/api`,
};