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

**⚠️ IMPORTANT: Search functionality requires API keys!**

The search feature uses:
- **Hugging Face API** - For generating search embeddings
- **Qdrant Vector Database** - For storing and searching product vectors

```bash
# 1. Copy the example environment file
cp .env.example .env.local

# 2. Edit .env.local and add your API keys
# At minimum, you need:
# - HF_TOKEN (Hugging Face API token)
# - QDRANT_URL and QDRANT_API_KEY (shared credentials - already in .env.example)
```

#### Required Environment Variables for Search

**Minimum required for search to work:**

1. **HF_TOKEN** (Hugging Face API Token)
   - Sign up at https://huggingface.co
   - Go to Settings → Access Tokens
   - Create a new token with "Read" permissions
   - Add it to `.env.local`: `HF_TOKEN=hf_your_token_here`

2. **QDRANT_URL** and **QDRANT_API_KEY**
   - These are shared credentials (already included in `.env.example`)
   - You can use the same values as provided

**Example `.env.local` (minimum setup for search):**
```env
HF_TOKEN=hf_your_huggingface_token_here
QDRANT_URL=https://2d684b58-dfb1-4058-967f-9d4f248030c8.us-east4-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.sRD2SjycruCSbj2HGoigYEwSh9TzT_zmOHa-3DGdTWg
```

#### Optional Environment Variables

- Google Sheets integration (for inventory sync)
- Square API (for Square integration)
- See `ENV_SETUP.md` for detailed setup instructions and all available options

**📖 For detailed step-by-step instructions, see `ENV_SETUP.md`**

**🚀 For production deployment instructions, see `DEPLOYMENT_GUIDE.md`**

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

**Search doesn't work / Returns empty results**
- ✅ Check that `.env.local` exists and has `HF_TOKEN` set
- ✅ Verify `QDRANT_URL` and `QDRANT_API_KEY` are in `.env.local`
- ✅ Restart your dev server after adding environment variables (`npm run dev`)
- ✅ Check the browser console for errors
- ✅ Check the terminal/server logs for API errors
- ℹ️ Hugging Face API tokens are free but rate-limited
- ℹ️ You need to create a Hugging Face account and generate a token

**"HF_TOKEN environment variable is not set" warning**
- Make sure you've created `.env.local` (not just `.env`)
- Verify the token format: `HF_TOKEN=hf_...` (starts with `hf_`)
- Restart your dev server after adding the token

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











