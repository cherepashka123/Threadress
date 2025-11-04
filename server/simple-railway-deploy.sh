#!/bin/bash
# Simple Railway deployment script
# Run this script to deploy CLIP service to Railway

echo "🚀 Deploying CLIP Service to Railway..."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔐 Logging in to Railway..."
railway login

# Initialize Railway project
echo "📁 Initializing Railway project..."
cd server
railway init

# Deploy
echo "🚀 Deploying..."
railway up

# Get service URL
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the service URL from Railway dashboard"
echo "2. Add to Vercel environment variables:"
echo "   CLIP_SERVICE_URL=https://your-service-url.railway.app"
echo "3. Redeploy your Vercel app"
echo ""
railway domain

