# 📚 COMPLETE SETUP & TROUBLESHOOTING GUIDE

## 🎯 Overview

TrackMyProgress v2.0 is an AI-powered learning platform with:
- **AI Chat** (like ChatGPT) powered by Google Gemini
- **AI Planner** for study plans
- **AI Summary** for progress analysis
- **Email Notifications** for feedback and contact forms

## 📋 Prerequisites

- **Node.js** 18+ (with npm)
- **Python** 3.9+
- **Internet** connection (for Gemini API)
- **Gmail account** (for email - optional)

## ⚙️ Step-by-Step Setup

### 1. Get Google Gemini API Key (FREE)

1. Go to: https://ai.google.dev
2. Click **"Create API Key"** (sign in to Google if prompted)
3. Copy the generated API key
4. **Keep it safe!** This is your authentication

### 2. Configure Environment Variables

1. Open `.env` file in the project root
2. Find the line: `GOOGLE_API_KEY=your-gemini-api-key-here`
3. Replace with your actual API key:
   ```
   GOOGLE_API_KEY=AIza...YourKeyHere...
   ```
4. Save the file

### 3. Install Dependencies

```bash
# Install Node.js packages
npm install

# Install Python packages
python3 -m pip install -r server/requirements.txt
```

### 4. Verify Setup (Optional)

Run the test script to verify everything is configured correctly:

```bash
chmod +x test-server.sh
./test-server.sh
```

### 5. Start the Application

**Method A: Using start script (Recommended)**

```bash
chmod +x start.sh
./start.sh
```

**Method B: Manual startup (2 terminals)**

Terminal 1 - Backend:
```bash
cd server
python3 -m uvicorn ai_server:app --reload
```

Terminal 2 - Frontend:
```bash
npm run dev
```

### 6. Open in Browser

Visit: **http://localhost:5173**

---

## 🧪 Testing the AI Chat

1. Click **"AI Tools"** in the navigation
2. Click **"Open"** next to **"AI Chat"**
3. Type a message like: `"Help me learn React"`
4. You should get a response from Gemini AI within 2-3 seconds

---

## �� Troubleshooting

### Error: "API key not valid"

**What it means:** The API key in `.env` is incorrect, expired, or invalid

**How to fix:**
1. Go to https://ai.google.dev again
2. Create a new API key
3. Copy the entire key (don't miss any characters)
4. Update `.env` file:
   ```
   GOOGLE_API_KEY=paste-entire-key-here
   ```
5. Restart the backend server (if running)

---

### Error: "Failed to fetch" or "Connection refused"

**What it means:** The backend server is not running or not reachable

**How to fix:**
1. Make sure backend is running:
   ```bash
   cd server
   python3 -m uvicorn ai_server:app --reload
   ```
2. Check the port is correct (default: 4000)
3. If port 4000 is in use, change it in `.env`:
   ```
   PORT=5000
   ```
   And update `VITE_API_BASE`:
   ```
   VITE_API_BASE=http://localhost:5000
   ```

---

### Error: "500 Internal Server Error"

**What it means:** The backend crashed or encountered an error

**How to fix:**
1. Check the backend terminal for error messages
2. Verify `GOOGLE_API_KEY` is correct in `.env`
3. Restart the backend:
   ```bash
   cd server
   python3 -m uvicorn ai_server:app --reload
   ```
4. Try again

---

### Error: "No module named 'google.generativeai'"

**What it means:** Python packages not installed correctly

**How to fix:**
```bash
python3 -m pip install -r server/requirements.txt
```

---

### Port Already in Use

**What it means:** Another application is using port 4000 or 5173

**How to fix:**

Option 1 - Use different ports:
```env
PORT=5000
VITE_API_BASE=http://localhost:5000
```

Option 2 - Kill the process:
```bash
lsof -ti:4000 | xargs kill -9
```

---

### Frontend loads but API calls fail

**What it means:** Frontend is running but can't communicate with backend

**How to fix:**
1. Check backend is running
2. Verify `VITE_API_BASE` in `.env` matches your backend URL
3. Check browser console for exact error message

---

## 📧 Email Setup (Optional)

### Gmail Setup

#### Step 1: Enable 2-Factor Authentication

1. Go to: https://myaccount.google.com/security
2. Find "How you sign in to Google"
3. Click **"2-Step Verification"**
4. Follow the prompts

#### Step 2: Create App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** in the dropdown
3. Select your device type
4. Google will generate a **16-character password**
5. Copy this password

#### Step 3: Update `.env`

```env
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx
SMTP_FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=manishpatel953249@gmail.com
```

#### Step 4: Restart Backend

---

## 🔐 Security Notes

1. **Never commit `.env` to Git!** It contains sensitive keys
2. Add `.env` to `.gitignore`
3. Keep your API key secret
4. Don't share your API key with anyone

---

## 📊 API Rate Limits (Free Tier)

- **Gemini API**: 15 requests/minute
- **Gmail**: 1000 emails/day

---

## 🎉 You're All Set!

Everything is configured and ready. Just add your Gemini API key and you're live!

