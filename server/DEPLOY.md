# CLIP Service Production Deployment Guide

This guide will help you deploy the CLIP embedding service to production so it works with your Vercel deployment.

## Quick Deploy Options

### Option 1: Railway (Recommended - Free Tier Available)

1. **Install Railway CLI** (optional, can use web UI):
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Deploy from this directory**:
   ```bash
   cd server
   railway init
   railway up
   ```

3. **Get your service URL**:
   - Railway will provide a URL like: `https://clip-service-production.up.railway.app`
   - Copy this URL

4. **Set in Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `CLIP_SERVICE_URL=https://your-railway-url.railway.app`
   - Redeploy your Vercel app

### Option 2: Render (Free Tier Available)

1. **Go to Render Dashboard**: https://render.com
2. **Create New Web Service**
3. **Connect your GitHub repo**
4. **Configure**:
   - **Root Directory**: `server`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn clip_api:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path**: `/health`
5. **Deploy** - Render will give you a URL like: `https://clip-service.onrender.com`
6. **Set in Vercel**: Add `CLIP_SERVICE_URL=https://your-service.onrender.com`

### Option 3: Google Cloud Run (Pay-as-you-go)

1. **Install gcloud CLI**
2. **Build and deploy**:
   ```bash
   cd server
   gcloud builds submit --tag gcr.io/YOUR-PROJECT/clip-service
   gcloud run deploy clip-service \
     --image gcr.io/YOUR-PROJECT/clip-service \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 2Gi \
     --cpu 1
   ```
3. **Get URL** and set in Vercel

### Option 4: Docker Deployment (Any VPS)

If you have a VPS (DigitalOcean, Linode, AWS EC2, etc.):

1. **Copy server files to your VPS**
2. **Build and run**:
   ```bash
   cd server
   docker build -t clip-service .
   docker run -d -p 8001:8001 --name clip-service --restart unless-stopped clip-service
   ```
3. **Set up reverse proxy** (nginx) or use the port directly
4. **Set in Vercel**: `CLIP_SERVICE_URL=https://your-vps-domain.com:8001`

## Testing Your Deployment

Once deployed, test your CLIP service:

```bash
# Test health endpoint
curl https://your-clip-service-url.com/health

# Test text embedding
curl -X POST https://your-clip-service-url.com/embed/text \
  -H "Content-Type: application/json" \
  -d '{"text": "red dress"}'

# Test image embedding
curl -X POST https://your-clip-service-url.com/embed/image \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://example.com/image.jpg"}'
```

## Environment Variables

Your deployed CLIP service doesn't need any special environment variables - it will work out of the box.

## Cost Estimates

- **Railway**: Free tier (500 hours/month), then $5/month
- **Render**: Free tier (750 hours/month), then $7/month
- **Google Cloud Run**: ~$0.10 per 1000 requests (very cheap)
- **VPS**: $5-10/month depending on provider

## Performance Notes

- First request may be slow (~30s) as model loads
- Subsequent requests are fast (50-200ms)
- CPU-only is fine, but GPU is faster (if available)
- Recommended: 2GB RAM minimum, 1 CPU core

## Troubleshooting

### Service not responding
- Check health endpoint: `/health`
- Check logs on your deployment platform
- Ensure port is correctly exposed

### Slow responses
- First request is always slow (model loading)
- Consider keeping service "warm" with a cron job
- Upgrade to a service with more CPU/RAM

### Out of memory errors
- Reduce batch sizes
- Upgrade to service with more RAM (2GB+ recommended)


