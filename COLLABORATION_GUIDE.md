# 🤝 Threadress Collaboration Guide

## For New Contributors (Your Friend)

### Initial Setup

1. **Fork the Repository**
   - Go to https://github.com/cherepashka123/Threadress
   - Click "Fork" button (top right)
   - This creates your own copy

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Threadress.git
   cd Threadress
   ```

3. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/cherepashka123/Threadress.git
   git remote -v
   # Should show:
   # origin    https://github.com/YOUR_USERNAME/Threadress.git (your fork)
   # upstream  https://github.com/cherepashka123/Threadress.git (main repo)
   ```

4. **Set Up Development Environment**
   ```bash
   # Install dependencies
   npm install
   
   # Create your environment file
   cp .env.example .env.local  # if available
   
   # Start development server
   npm run dev
   ```

## Daily Workflow

### Getting Latest Updates
```bash
# 1. Fetch latest changes from main repo
git fetch upstream

# 2. Update your main branch
git checkout main
git merge upstream/main

# 3. Push updates to your fork
git push origin main
```

### Making Changes
```bash
# 1. Create a new branch for your feature
git checkout -b feature/your-feature-name

# 2. Make your changes
# ... work on the code ...

# 3. Commit your changes
git add .
git commit -m "Add: brief description of changes"

# 4. Push to your fork
git push origin feature/your-feature-name

# 5. Create Pull Request
# Go to your fork on GitHub and click "Compare & pull request"
```

### Branch Naming Convention
- `feature/description` - New features
- `fix/description` - Bug fixes
- `update/description` - Updates to existing features
- `style/description` - Styling changes
- `docs/description` - Documentation updates

## Pull Request Guidelines

### Before Creating a PR
- [ ] Make sure your branch is up to date with main
- [ ] Test your changes locally
- [ ] Write a clear description of what you changed
- [ ] Add screenshots if UI changes were made

### PR Description Template
```markdown
## What Changed
Brief description of what you implemented/fixed

## Why
Why this change was needed

## How to Test
Steps to test the changes

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows project style
- [ ] Self-review completed
- [ ] No console errors
- [ ] Mobile responsive (if UI changes)
```

## Resolving Conflicts

If you get merge conflicts:

```bash
# 1. Fetch latest changes
git fetch upstream
git checkout main
git merge upstream/main

# 2. Switch to your feature branch
git checkout feature/your-feature-name

# 3. Merge main into your branch
git merge main

# 4. Resolve conflicts in your editor
# Look for <<<<<<< HEAD markers and resolve

# 5. Commit the resolution
git add .
git commit -m "Resolve merge conflicts"

# 6. Push updated branch
git push origin feature/your-feature-name
```

## Environment Setup

### Required Software
- Node.js (v18 or higher)
- npm or yarn
- Git

### Environment Variables
Create `.env.local` with your own settings:
```env
# Add any environment-specific variables here
# Don't commit this file - it's in .gitignore
```

## Getting Help

- Check existing issues on GitHub
- Create a new issue for bugs or feature requests
- Use descriptive commit messages
- Keep PRs focused on one feature/fix

## Best Practices

1. **Always pull before starting work**
2. **Create feature branches for each change**
3. **Write descriptive commit messages**
4. **Test your changes before submitting PR**
5. **Keep PRs small and focused**
6. **Communicate about major changes**

## Quick Commands Reference

```bash
# Get latest updates
git fetch upstream && git checkout main && git merge upstream/main

# Create new feature branch
git checkout -b feature/your-feature

# Check status
git status

# See what's different
git diff

# See commit history
git log --oneline

# Switch branches
git checkout branch-name

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name
```












