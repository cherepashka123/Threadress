# Environment Variables Setup Guide

This guide explains how to set up environment variables so search functionality works in your **local development environment**.

**🚀 For production deployment (where users don't need to set up anything), see `DEPLOYMENT_GUIDE.md`**

## Quick Setup for Search

To make search work, you need to create a `.env.local` file in the root directory with these minimum required variables:

```env
# REQUIRED FOR SEARCH TO WORK
HF_TOKEN=hf_your_huggingface_token_here
QDRANT_URL=https://2d684b58-dfb1-4058-967f-9d4f248030c8.us-east4-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.sRD2SjycruCSbj2HGoigYEwSh9TzT_zmOHa-3DGdTWg
```

## Step-by-Step Setup

### 1. Create `.env.local` file

In the root directory of the project, create a file named `.env.local`:

```bash
touch .env.local
```

### 2. Get Your Hugging Face API Token

1. Go to https://huggingface.co and create an account (or log in)
2. Go to your profile → Settings → Access Tokens
3. Click "New token"
4. Name it (e.g., "threadress-dev")
5. Select "Read" permissions
6. Click "Generate token"
7. Copy the token (it starts with `hf_`)

### 3. Add Variables to `.env.local`

Open `.env.local` and add:

```env
# Hugging Face API Token (REQUIRED)
# Get from: https://huggingface.co/settings/tokens
HF_TOKEN=hf_your_token_here_paste_it

# Qdrant Configuration (REQUIRED - shared credentials)
QDRANT_URL=https://2d684b58-dfb1-4058-967f-9d4f248030c8.us-east4-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.sRD2SjycruCSbj2HGoigYEwSh9TzT_zmOHa-3DGdTWg
```

**Important:** Replace `hf_your_token_here_paste_it` with your actual Hugging Face token!

### 4. Restart Your Dev Server

After adding the environment variables:

```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

## What Each Variable Does

### `HF_TOKEN` (Required)
- **What it does**: Allows the app to generate embeddings (vector representations) of search queries
- **Why it's needed**: Search converts your text query into a vector to find similar products
- **Where to get it**: https://huggingface.co/settings/tokens
- **Cost**: Free (with rate limits)

### `QDRANT_URL` (Required)
- **What it does**: URL of the Qdrant vector database
- **Why it's needed**: Stores and searches product vectors
- **Where to get it**: Already provided (shared database)
- **Cost**: Free (shared instance)

### `QDRANT_API_KEY` (Required)
- **What it does**: Authentication key for Qdrant
- **Why it's needed**: Allows the app to connect to the vector database
- **Where to get it**: Already provided (shared key)
- **Cost**: Free (shared key)

## Optional Environment Variables

These are only needed for specific features:

### Google Sheets Integration
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id
GOOGLE_CLOUD_PROJECT=fluent-imprint-476400-c5
VERTEX_LOCATION=us-central1
```

### Square API Integration
```env
SQUARE_ACCESS_TOKEN=your_square_access_token_here
SQUARE_APP_ID=your_square_app_id_here
SQUARE_ENVIRONMENT=sandbox
```

### Next.js Configuration
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
EMBEDDING_SERVICE_URL=http://localhost:8000
```

## Troubleshooting

### Search returns empty results

1. **Check `.env.local` exists**: Make sure the file is in the root directory (same level as `package.json`)
2. **Check token format**: Should start with `hf_`
3. **Restart server**: Environment variables are only loaded when the server starts
4. **Check console**: Look for errors in browser console and terminal
5. **Verify token**: Make sure your Hugging Face token is valid and has "Read" permissions

### "HF_TOKEN environment variable is not set" warning

- Make sure the file is named exactly `.env.local` (with the dot)
- Make sure there's no space around the `=` sign: `HF_TOKEN=hf_...` (not `HF_TOKEN = hf_...`)
- Restart your dev server after making changes

### Search works for you but not for your friend

**This is the issue!** Each developer needs their own `.env.local` file with:
- Their own `HF_TOKEN` (each person needs their own Hugging Face account/token)
- The shared `QDRANT_URL` and `QDRANT_API_KEY` (these can be the same for everyone)

**Solution**: Share this guide with your friend so they can:
1. Create their own Hugging Face account
2. Generate their own token
3. Create their own `.env.local` file

## Security Notes

- ✅ `.env.local` is already in `.gitignore` - it won't be committed to git
- ✅ Never commit API keys or tokens to git
- ✅ Each developer should have their own Hugging Face token
- ✅ Qdrant credentials can be shared (they're for a shared database instance)

## Need Help?

1. Check `SETUP_INSTRUCTIONS.md` for general setup
2. Check browser console for errors
3. Check terminal logs for API errors
4. Verify your Hugging Face token works: https://huggingface.co/settings/tokens

