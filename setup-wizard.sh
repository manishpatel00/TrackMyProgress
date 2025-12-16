#!/bin/bash
# Setup wizard for TrackMyProgress with Gemini AI

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║   🚀 TrackMyProgress v2.0 - Setup Wizard                      ║"
echo "║                                                                ║"
echo "║   This will help you configure Gemini API and Email           ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if .env exists
ENV_FILE="$(dirname "$0")/.env"

if [ ! -f "$ENV_FILE" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

echo "📋 Current Configuration:"
echo ""

# Check Gemini API Key
API_KEY=$(grep "^GOOGLE_API_KEY=" "$ENV_FILE" | cut -d'=' -f2)
if [ -z "$API_KEY" ] || [ "$API_KEY" = "your-gemini-api-key-here" ]; then
    echo "❌ GOOGLE_API_KEY: NOT CONFIGURED"
    HAS_ERRORS=1
else
    echo "✅ GOOGLE_API_KEY: Configured (${API_KEY:0:15}...)"
fi

# Check Model
MODEL=$(grep "^GENAI_MODEL=" "$ENV_FILE" | cut -d'=' -f2)
echo "✅ GENAI_MODEL: $MODEL"

# Check SMTP
SMTP_USER=$(grep "^SMTP_USER=" "$ENV_FILE" | cut -d'=' -f2)
if [ -z "$SMTP_USER" ] || [ "$SMTP_USER" = "your-email@gmail.com" ]; then
    echo "⚠️  SMTP_USER: NOT CONFIGURED (optional)"
else
    echo "✅ SMTP_USER: Configured ($SMTP_USER)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$HAS_ERRORS" = "1" ]; then
    echo "🔧 SETUP REQUIRED"
    echo ""
    echo "Step 1: Get Gemini API Key"
    echo "   1. Open: https://ai.google.dev"
    echo "   2. Click 'Create API Key' (or sign in first)"
    echo "   3. Copy the API key"
    echo "   4. Open .env file and replace GOOGLE_API_KEY value"
    echo ""
    echo "Step 2 (Optional): Setup Email Notifications"
    echo "   1. Enable Gmail 2FA: myaccount.google.com/security"
    echo "   2. Create app password: myaccount.google.com/apppasswords"
    echo "   3. Copy the 16-character password"
    echo "   4. Update .env with SMTP settings"
    echo ""
    echo "Step 3: Install Dependencies"
    echo "   npm install"
    echo "   python3 -m pip install -r server/requirements.txt"
    echo ""
    echo "Step 4: Start the Application"
    echo "   chmod +x start.sh"
    echo "   ./start.sh"
    echo ""
    exit 1
else
    echo "✅ Configuration looks good!"
    echo ""
    echo "📦 Installing dependencies..."
    echo ""
    
    # Install Node dependencies
    if [ -f "package.json" ]; then
        echo "Installing Node.js packages..."
        npm install --legacy-peer-deps
        echo ""
    fi
    
    # Install Python dependencies
    if [ -f "server/requirements.txt" ]; then
        echo "Installing Python packages..."
        python3 -m pip install -q -r server/requirements.txt
        echo ""
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "✅ Setup Complete!"
    echo ""
    echo "🚀 Ready to start! Run:"
    echo "   chmod +x start.sh"
    echo "   ./start.sh"
    echo ""
    echo "Or start manually:"
    echo "   Terminal 1: cd server && python3 -m uvicorn ai_server:app --reload"
    echo "   Terminal 2: npm run dev"
    echo ""
    echo "🌐 Then open: http://localhost:5173"
    echo ""
fi
