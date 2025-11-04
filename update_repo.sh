#!/bin/bash

echo "🔄 Updating Threadress repository..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run this from the project directory."
    exit 1
fi

# Fetch latest changes
echo "📥 Fetching latest changes..."
git fetch origin

# Check if there are updates
if [ $(git rev-list HEAD...origin/main --count) -eq 0 ]; then
    echo "✅ Repository is already up to date!"
    exit 0
fi

# Show what's new
echo "📋 New changes:"
git log HEAD..origin/main --oneline

# Ask for confirmation
read -p "Do you want to pull these changes? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "⬇️  Pulling changes..."
    git pull origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully updated!"
        echo "📦 Installing/updating dependencies..."
        npm install
    else
        echo "❌ There were conflicts. Please resolve them manually."
        echo "💡 Run 'git status' to see what needs to be resolved."
    fi
else
    echo "⏸️  Update cancelled."
fi











