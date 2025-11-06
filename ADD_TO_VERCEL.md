# Add Railway CLIP Service URL to Vercel

## Quick Steps:

1. **Get your Railway URL** from https://railway.app/dashboard
   - It will look like: `https://clip-service-production-xxxx.up.railway.app`

2. **Go to Vercel**: https://vercel.com/dashboard

3. **Select your project** (threadress-site)

4. **Settings** → **Environment Variables**

5. **Add new variable**:
   ```
   Key: CLIP_SERVICE_URL
   Value: https://your-railway-url.railway.app
   Environment: Production (✓) and Preview (optional)
   ```

6. **Save** and **Redeploy** your Vercel app

## After Adding:

- The next deployment will use your Railway CLIP service
- Check Vercel logs to confirm it's connecting
- Search should work better with CLIP embeddings!

## Test Your Railway Service:

```bash
curl https://your-railway-url.railway.app/health
```

Should return: `{"status":"healthy","service":"clip-embeddings"}`


