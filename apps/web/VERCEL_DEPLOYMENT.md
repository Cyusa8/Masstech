# Vercel Deployment Guide

This application is configured for deployment on Vercel.

## Setup Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   # or
   bun add -g vercel
   ```

2. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   
   Or connect your GitHub repository to Vercel for automatic deployments.

## Environment Variables

Make sure to set the following environment variables in your Vercel project settings:

### Required:
- `DATABASE_URL` - Your database connection string (e.g., Neon PostgreSQL)

### Optional but Recommended:
- `AUTH_SECRET` - Secret key for authentication (generate a random string)
- `CORS_ORIGINS` - Comma-separated list of allowed CORS origins

### Optional:
- `NEXT_PUBLIC_CREATE_BASE_URL` - Base URL for Create integrations (defaults to `https://www.create.xyz`)
- `NEXT_PUBLIC_CREATE_HOST` - Host header for Create integrations
- `NEXT_PUBLIC_PROJECT_GROUP_ID` - Project group ID for Create integrations

## Build Configuration

The project uses:
- **Build Command**: `bun run build`
- **Output Directory**: `.react-router/client`
- **Install Command**: `bun install`
- **Runtime**: Node.js 20.x

## Notes

- The application uses React Router v7 with SSR
- Serverless functions are handled via `/api/server.js`
- All routes are rewritten to the serverless function for SSR

