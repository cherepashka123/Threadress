#!/bin/bash
# Quick setup script for Hugging Face Spaces
# This helps automate some steps

echo "🚀 Hugging Face Spaces Setup Helper"
echo ""

# Check if HF CLI is installed
if ! command -v huggingface-cli &> /dev/null; then
    echo "⚠️  Hugging Face CLI not found. Installing..."
    pip install huggingface_hub
fi

# Check if logged in
if ! huggingface-cli whoami &> /dev/null; then
    echo "⚠️  Not logged in to Hugging Face. Please login:"
    echo "   huggingface-cli login"
    echo ""
    echo "Get your token from: https://huggingface.co/settings/tokens"
    exit 1
fi

HF_USERNAME=$(huggingface-cli whoami | head -n 1)
echo "✅ Logged in as: $HF_USERNAME"
echo ""

# Ask for space name
read -p "Enter your HF Space name (or press Enter for 'threadress-clip'): " SPACE_NAME
SPACE_NAME=${SPACE_NAME:-threadress-clip}

SPACE_URL="https://huggingface.co/spaces/$HF_USERNAME/$SPACE_NAME"

echo ""
echo "📋 Your space will be at: $SPACE_URL"
echo ""
read -p "Have you already created this space on HF? (y/n): " SPACE_EXISTS

if [ "$SPACE_EXISTS" != "y" ]; then
    echo ""
    echo "📝 Please create the space first:"
    echo "   1. Go to: https://huggingface.co/new-space"
    echo "   2. Space name: $SPACE_NAME"
    echo "   3. SDK: Docker"
    echo "   4. Visibility: Public (or Private)"
    echo "   5. Click 'Create Space'"
    echo ""
    read -p "Press Enter when you've created the space..."
fi

# Clone the space
echo ""
echo "📥 Cloning your HF Space..."
if [ -d "$SPACE_NAME" ]; then
    echo "⚠️  Directory $SPACE_NAME already exists. Removing..."
    rm -rf "$SPACE_NAME"
fi

git clone "https://huggingface.co/spaces/$HF_USERNAME/$SPACE_NAME"
cd "$SPACE_NAME"

# Copy files
echo ""
echo "📋 Copying files..."
cp ../clip_api.py .
cp ../clip_service.py .
cp ../requirements.txt .
cp ../Dockerfile.hf ./Dockerfile
cp ../README_SPACE.md ./README.md
cp ../app.py .

# Remove .gitignore if it blocks our files
if [ -f .gitignore ]; then
    # Make sure our files aren't ignored
    echo "clip_api.py" >> .gitignore
    echo "clip_service.py" >> .gitignore
    echo "requirements.txt" >> .gitignore
    echo "Dockerfile" >> .gitignore
    echo "README.md" >> .gitignore
    echo "app.py" >> .gitignore
fi

echo "✅ Files copied!"
echo ""

# Show what to do next
echo "📝 Next steps:"
echo "   1. Review the files:"
echo "      cd $SPACE_NAME"
echo "      ls -la"
echo ""
echo "   2. Commit and push:"
echo "      git add ."
echo "      git commit -m 'Add CLIP embedding service'"
echo "      git push"
echo ""
echo "   3. Wait for build (5-10 minutes)"
echo "      Watch at: $SPACE_URL"
echo ""
echo "   4. Test your service:"
echo "      curl $SPACE_URL/health"
echo ""
echo "   5. Update Vercel env var:"
echo "      CLIP_SERVICE_URL=$SPACE_URL"
echo ""

