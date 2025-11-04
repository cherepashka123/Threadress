# Production Deployment Guide

This guide explains how to deploy Threadress to production and ensure search functionality works for all users.

## How Search Works in Production

### Architecture Overview

```
User's Browser → Your Website → /api/inventory-search → Server-side API Keys → Hugging Face + Qdrant → Results → User
```

**Key Point:** Users **do NOT** need API keys. The API keys are stored securely on your server and used by your API routes.

### Why It Works

1. **Server-Side API Routes**: Your search uses Next.js API routes (`/api/inventory-search`) that run on the **server**, not in the browser
2. **Environment Variables**: API keys are accessed via `process.env` which is only available server-side
3. **No Client Exposure**: API keys never reach the user's browser - they stay secure on your server
4. **Users Just Use the App**: Users simply type in search queries, and your server handles all the API calls

## Deployment Steps

### 1. Choose a Hosting Platform

Recommended platforms:
- **Vercel** (Recommended for Next.js) - [vercel.com](https://vercel.com)
- **Netlify** - [netlify.com](https://netlify.com)
- **Railway** - [railway.app](https://railway.app)
- **AWS/GCP/Azure** - For enterprise deployments

### 2. Set Up Environment Variables

**⚠️ CRITICAL:** Add these environment variables in your hosting platform's dashboard:

#### Required for Search to Work:

```env
HF_TOKEN=hf_your_production_token_here
QDRANT_URL=https://2d684b58-dfb1-4058-967f-9d4f248030c8.us-east4-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.sRD2SjycruCSbj2HGoigYEwSh9TzT_zmOHa-3DGdTWg
```

#### Optional (if using these features):

```env
# Google Sheets Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id
GOOGLE_CLOUD_PROJECT=fluent-imprint-476400-c5
VERTEX_LOCATION=us-central1

# Square API Integration
SQUARE_ACCESS_TOKEN=your_square_access_token_here
SQUARE_APP_ID=your_square_app_id_here
SQUARE_ENVIRONMENT=production

# Next.js Configuration
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 3. Platform-Specific Instructions

#### Vercel

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   - In your project settings → Environment Variables
   - Add each variable from step 2 above
   - **Important**: Mark them as "Production", "Preview", and "Development" as needed

4. **Deploy**
   - Vercel will automatically deploy
   - Your site will be live at `your-project.vercel.app`

#### Netlify

1. **Push to Git Repository**

2. **Add New Site in Netlify**
   - Import from Git provider
   - Build command: `npm run build`
   - Publish directory: `.next`

3. **Add Environment Variables**
   - Site settings → Environment variables
   - Add all required variables

4. **Deploy**

#### Railway

1. **Connect Repository**
   - Create new project from GitHub

2. **Add Environment Variables**
   - Variables tab → Add each variable

3. **Deploy**
   - Railway auto-deploys on push

### 4. Verify Deployment

After deployment, test:

1. **Check Search Works**
   - Visit your deployed site
   - Try searching for something (e.g., "summer dress")
   - Verify results appear

2. **Check API Route**
   - Visit `https://your-domain.com/api/inventory-search?q=test`
   - Should return JSON with search results

3. **Check Server Logs**
   - Look for any API errors
   - Verify environment variables are loaded

## Important Considerations

### API Rate Limits

**Hugging Face Free Tier:**
- Limited requests per hour
- Consider upgrading for production:
  - [Hugging Face Pro](https://huggingface.co/pricing)
  - Or use your own embedding model

**Qdrant Free Tier:**
- Shared instance has rate limits
- For production, consider:
  - Qdrant Cloud paid plan
  - Self-hosted Qdrant instance
  - Or upgrade the shared instance

### Security Best Practices

1. **Never commit `.env.local`** ✅ (already in `.gitignore`)
2. **Rotate API keys periodically**
3. **Use separate tokens for dev/staging/production**
4. **Monitor API usage** to detect abuse
5. **Set up rate limiting** on your API routes for abuse prevention

### Cost Estimates

**Free Tier (Development/Testing):**
- Hugging Face: Free with rate limits
- Qdrant: Free shared instance
- Hosting: Vercel free tier available

**Production Scale (Example for 10K users/month):**
- Hugging Face: ~$20-50/month (Pro plan)
- Qdrant: ~$30-100/month (depending on data size)
- Hosting: Vercel Pro ~$20/month
- **Total: ~$70-170/month**

### Scaling Considerations

If you expect high traffic:

1. **Caching**: Implement caching for common searches
2. **CDN**: Use Vercel/Netlify Edge Functions for faster responses
3. **Database**: Consider upgrading Qdrant plan for more capacity
4. **Rate Limiting**: Implement per-user rate limits
5. **Monitoring**: Set up error tracking (Sentry, LogRocket, etc.)

## Troubleshooting Production Issues

### Search Not Working for Users

1. **Check Environment Variables**
   - Verify all variables are set in deployment dashboard
   - Make sure they're marked for "Production" environment
   - Check for typos in variable names

2. **Check API Limits**
   - Hugging Face: Check your usage at https://huggingface.co/settings/billing
   - Qdrant: Check instance status

3. **Check Server Logs**
   - Look for API errors
   - Check for rate limit errors
   - Verify API keys are being read correctly

4. **Test API Endpoint Directly**
   ```bash
   curl "https://your-domain.com/api/inventory-search?q=test"
   ```

### "HF_TOKEN is not set" Errors

- Environment variable not configured in deployment platform
- Variable name typo (should be exactly `HF_TOKEN`)
- Need to redeploy after adding environment variables

### Rate Limit Errors

- Upgrade Hugging Face plan
- Implement caching for common queries
- Add rate limiting to prevent abuse

## Example Deployment Checklist

- [ ] Code pushed to Git repository
- [ ] Project imported to hosting platform
- [ ] All environment variables added
- [ ] Environment variables set for correct environments (production/preview/development)
- [ ] Site deployed successfully
- [ ] Search functionality tested
- [ ] API endpoint tested directly
- [ ] Server logs checked for errors
- [ ] Monitoring/alerts set up (optional but recommended)
- [ ] Domain configured (optional)

## Next Steps After Deployment

1. **Set up custom domain** (if desired)
2. **Configure SSL/HTTPS** (automatic on most platforms)
3. **Set up monitoring** (error tracking, analytics)
4. **Configure backups** (if using database)
5. **Set up CI/CD** (auto-deploy on push)
6. **Configure environment-specific variables** (dev/staging/prod)

## Summary

✅ **Users don't need API keys** - they just use your website  
✅ **You configure API keys once** - in your hosting platform  
✅ **Keys stay secure** - never exposed to users  
✅ **Search works for everyone** - no setup required by users  

The search functionality will work automatically for all users once you configure the environment variables in your deployment platform!

