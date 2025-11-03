# 🛠️ Threadress Development Setup

## Quick Start for New Contributors

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- A GitHub account

### 1. Fork & Clone
```bash
# 1. Fork the repository on GitHub
# Go to: https://github.com/cherepashka123/Threadress
# Click "Fork" button

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/Threadress.git
cd Threadress

# 3. Add upstream remote
git remote add upstream https://github.com/cherepashka123/Threadress.git
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
# Create your local environment file
cp .env.example .env.local  # if available
# Or create .env.local with your settings
```

### 4. Start Development
```bash
npm run dev
```

Visit: http://localhost:3000

## Daily Workflow

### Option A: Use the Helper Script
```bash
./sync_and_work.sh
```

### Option B: Manual Commands

**Get latest updates:**
```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

**Start new feature:**
```bash
git checkout -b feature/your-feature-name
# ... make changes ...
git add .
git commit -m "Add: your changes"
git push origin feature/your-feature-name
```

**Create Pull Request:**
1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the description
4. Submit!

## Troubleshooting

### Common Issues

**"Command not found: npm"**
- Install Node.js from https://nodejs.org/

**"Permission denied" errors**
- Make sure scripts are executable: `chmod +x *.sh`

**Merge conflicts**
- Follow the guide in COLLABORATION_GUIDE.md

**Port already in use**
- Change port: `npm run dev -- --port 3001`

### Getting Help
- Check existing GitHub issues
- Create a new issue with details
- Ask in the project discussions

## Project Structure
```
threadress-site/
├── src/                    # Source code
├── public/                 # Static assets
├── package.json           # Dependencies
├── next.config.js         # Next.js config
├── tailwind.config.js     # Tailwind config
├── sync_and_work.sh       # Helper script
└── COLLABORATION_GUIDE.md # Detailed guide
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter










