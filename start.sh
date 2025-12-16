#!/bin/bash
# Startup script for the Coding Journey Tracker with AI Tools

echo "🚀 Starting Coding Journey Tracker with Gemini AI..."
echo ""

# Check if GOOGLE_API_KEY is set
if [ -z "$GOOGLE_API_KEY" ]; then
    echo "⚠️  WARNING: GOOGLE_API_KEY is not set!"
    echo "Get your API key from: https://ai.google.dev/"
    echo "Then set it in your .env file or as an environment variable:"
    echo ""
    echo "export GOOGLE_API_KEY='your-api-key-here'"
    echo ""
fi

# Start the Python AI server in the background
echo "📦 Starting AI Server..."
cd "$(dirname "$0")/server"
python3 -m uvicorn ai_server:app --host 0.0.0.0 --port 4000 &
SERVER_PID=$!
cd ..

# Give the server time to start
sleep 2

# Start the React development server
echo "🎨 Starting React Development Server..."
npm run dev

# Cleanup when done
trap "kill $SERVER_PID" EXIT
