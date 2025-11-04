#!/bin/bash

echo "🚀 Threadress Development Helper"
echo "================================"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository. Please run this from the project directory."
    exit 1
fi

# Check if upstream remote exists
if ! git remote | grep -q upstream; then
    echo "⚠️  Upstream remote not found. Setting up..."
    read -p "Enter your GitHub username: " username
    git remote add upstream https://github.com/cherepashka123/Threadress.git
    echo "✅ Upstream remote added!"
fi

echo ""
echo "What would you like to do?"
echo "1) Get latest updates from main repo"
echo "2) Create new feature branch"
echo "3) Switch to existing branch"
echo "4) Push current changes"
echo "5) Create Pull Request"
echo "6) Show current status"
echo ""

read -p "Choose option (1-6): " choice

case $choice in
    1)
        echo "📥 Getting latest updates..."
        git fetch upstream
        git checkout main
        git merge upstream/main
        git push origin main
        echo "✅ Updated! Don't forget to run 'npm install' if dependencies changed."
        ;;
    2)
        read -p "Enter feature name (e.g., 'add-search-filter'): " feature_name
        git checkout -b "feature/$feature_name"
        echo "✅ Created and switched to feature/$feature_name"
        echo "💡 Start coding! When done, use option 4 to push your changes."
        ;;
    3)
        echo "Available branches:"
        git branch -a
        read -p "Enter branch name: " branch_name
        git checkout "$branch_name"
        echo "✅ Switched to $branch_name"
        ;;
    4)
        echo "Current changes:"
        git status
        echo ""
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        git push origin HEAD
        echo "✅ Changes pushed!"
        echo "💡 Go to GitHub to create a Pull Request"
        ;;
    5)
        current_branch=$(git branch --show-current)
        echo "Current branch: $current_branch"
        echo "To create a Pull Request:"
        echo "1. Go to https://github.com/YOUR_USERNAME/Threadress"
        echo "2. Click 'Compare & pull request'"
        echo "3. Fill out the PR description"
        ;;
    6)
        echo "📊 Current Status:"
        echo "=================="
        echo "Current branch: $(git branch --show-current)"
        echo "Last commit: $(git log -1 --oneline)"
        echo ""
        echo "Recent changes:"
        git status
        echo ""
        echo "Recent commits:"
        git log --oneline -5
        ;;
    *)
        echo "❌ Invalid option"
        ;;
esac











