#!/bin/bash
# Test server configuration and API connectivity

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║   🧪 TrackMyProgress - Server Configuration Test              ║"
echo "║                                                                ║"
echo "║   This script verifies your setup is correct                  ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
cd "$SCRIPT_DIR" || exit 1

# Test 1: Check .env file
echo "📋 Test 1: Checking .env configuration..."
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi

API_KEY=$(grep "^GOOGLE_API_KEY=" .env | cut -d'=' -f2 | tr -d ' ')
if [ -z "$API_KEY" ] || [ "$API_KEY" = "your-gemini-api-key-here" ]; then
    echo -e "${RED}❌ GOOGLE_API_KEY not configured${NC}"
    echo -e "   ${YELLOW}Fix: Update GOOGLE_API_KEY in .env file${NC}"
    exit 1
else
    echo -e "${GREEN}✅ GOOGLE_API_KEY configured${NC}"
fi

# Test 2: Check Python
echo ""
echo "📋 Test 2: Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found${NC}"
    exit 1
else
    PY_VERSION=$(python3 --version)
    echo -e "${GREEN}✅ $PY_VERSION found${NC}"
fi

# Test 3: Check Python packages
echo ""
echo "📋 Test 3: Checking Python packages..."
python3 << 'PYTHON_TEST'
import sys
packages_ok = True

required_packages = [
    'fastapi',
    'uvicorn',
    'google.generativeai',
    'dotenv',
]

for pkg in required_packages:
    try:
        __import__(pkg)
        print(f'  ✅ {pkg}')
    except ImportError:
        print(f'  ❌ {pkg} - Run: pip install -r server/requirements.txt')
        packages_ok = False

if not packages_ok:
    sys.exit(1)
PYTHON_TEST

if [ $? -ne 0 ]; then
    echo -e "${RED}Install packages: python3 -m pip install -r server/requirements.txt${NC}"
    exit 1
fi

# Test 4: Check Node.js
echo ""
echo "📋 Test 4: Checking Node.js installation..."
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js/npm not found (only needed for frontend)${NC}"
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js $NODE_VERSION found${NC}"
fi

# Test 5: Test Gemini API
echo ""
echo "📋 Test 5: Testing Gemini API connection..."
python3 << 'GEMINI_TEST'
import os
import sys
from pathlib import Path

# Load .env
env_file = Path('.env')
if env_file.exists():
    with open(env_file) as f:
        for line in f:
            if line.startswith('GOOGLE_API_KEY='):
                key = line.split('=', 1)[1].strip()
                os.environ['GOOGLE_API_KEY'] = key
            elif line.startswith('GENAI_MODEL='):
                model = line.split('=', 1)[1].strip()
                os.environ['GENAI_MODEL'] = model

try:
    import google.generativeai as genai
    
    api_key = os.environ.get('GOOGLE_API_KEY')
    model_name = os.environ.get('GENAI_MODEL', 'gemini-2.5-flash')
    
    if not api_key:
        print('  ❌ GOOGLE_API_KEY not found')
        sys.exit(1)
    
    print(f'  Configuring with API key...')
    genai.configure(api_key=api_key)
    
    print(f'  Creating model instance ({model_name})...')
    model = genai.GenerativeModel(model_name)
    
    print(f'  Sending test request to Gemini...')
    response = model.generate_content('Say "Hello" in one word.')
    
    if response.text:
        print(f'  ✅ API connection successful!')
        print(f'     Response: {response.text[:50]}')
    else:
        print(f'  ❌ No response from API')
        sys.exit(1)
        
except Exception as e:
    error_msg = str(e)
    if 'API key not valid' in error_msg:
        print(f'  ❌ Invalid API key')
        print(f'     Fix: Get a new key from https://ai.google.dev')
    elif 'not found' in error_msg:
        print(f'  ❌ Model not found: {model_name}')
        print(f'     Fix: Check GENAI_MODEL in .env')
    else:
        print(f'  ❌ Connection failed: {error_msg[:80]}')
    sys.exit(1)
GEMINI_TEST

if [ $? -ne 0 ]; then
    exit 1
fi

# Test 6: Check ports
echo ""
echo "📋 Test 6: Checking available ports..."
if lsof -Pi :4000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 4000 already in use${NC}"
    echo "   Kill existing process or use different PORT in .env"
else
    echo -e "${GREEN}✅ Port 4000 available${NC}"
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 5173 already in use${NC}"
else
    echo -e "${GREEN}✅ Port 5173 available${NC}"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✅ All tests passed! Ready to start.${NC}"
echo ""
echo "🚀 Next steps:"
echo "   1. Start backend: cd server && python3 -m uvicorn ai_server:app --reload"
echo "   2. Start frontend: npm run dev"
echo "   3. Open: http://localhost:5173"
echo ""
