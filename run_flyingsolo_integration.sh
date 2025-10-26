#!/bin/bash

# Run FlyingSolo integration process
echo "🚀 Starting FlyingSolo integration process..."
echo "=============================================="

# Step 1: Scrape FlyingSolo data
echo "📡 Step 1: Scraping FlyingSolo.nyc data..."
python3 scrape_flyingsolo.py

if [ $? -ne 0 ]; then
    echo "❌ Scraping failed!"
    exit 1
fi

echo "✅ Scraping completed!"

# Step 2: Integrate with semantic search
echo "🔗 Step 2: Integrating with semantic search system..."
cd server
source .venv/bin/activate
cd ..
python3 integrate_flyingsolo.py

if [ $? -ne 0 ]; then
    echo "❌ Integration failed!"
    exit 1
fi

echo "✅ Integration completed!"

# Step 3: Restart backend server
echo "🔄 Step 3: Restarting backend server..."
pkill -f "uvicorn serve:app" 2>/dev/null
sleep 2

cd server
source .venv/bin/activate
uvicorn serve:app --reload --port 8000 --host 0.0.0.0 &
cd ..

echo "✅ Backend server restarted!"

echo ""
echo "🎉 FlyingSolo integration complete!"
echo "=================================="
echo "✅ Scraped FlyingSolo.nyc product data"
echo "✅ Integrated with semantic search indices"
echo "✅ Backend server restarted"
echo ""
echo "🌐 Visit http://localhost:3000/lab to see FlyingSolo products in the semantic search!"
echo "🔍 Try searching for items like 'light blue tweed blazer' or 'vintage leather jacket'"
echo ""
echo "📊 Check the results - you should now see FlyingSolo products mixed with the original dataset."
