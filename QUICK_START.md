# 🚀 QUICK START GUIDE - TrackMyProgress v2.0

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies

```bash
# Install Node.js packages
npm install

# Install Python packages (optional if you use backend features)
python3 -m pip install -r server/requirements.txt
```

### Step 2: Start the Application

You can use the included start script or run services manually.

```bash
# Make the script executable
chmod +x start.sh

# Run the application
./start.sh
```

Or run manually in two terminals:

**Terminal 1** (Backend):
```bash
cd server
python3 -m uvicorn ai_server:app --reload
```

**Terminal 2** (Frontend):
```bash
npm run dev
```

### Step 3: Open in Browser

Open: **http://localhost:5173**

---

## ✅ Verify Everything Works

1. **Login** with any email (or use demo credentials)
2. Navigate the app: Dashboard, Daily Plan, Journey Log, Statistics

---

## 📁 Project Structure (trimmed)

```
.
├── .env                          # Configuration
├── package.json                  # Node.js dependencies
├── src/
│   ├── components/               # UI components
│   └── pages/                    # Page components
├── server/                       # Backend services
│   └── requirements.txt          # Python packages
└── start.sh                      # Start script
```

---

## 🔧 Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| "Connection refused" | Backend not running | Run: `python3 -m uvicorn ai_server:app --reload` |
| "500 Error" | Backend crashed | Check server logs, restart server |
| Port already in use | Another app using port | Change PORT in .env or kill other app |

---

## 🆘 Need Help?

1. **Check the logs**: Look at terminal output for error messages
2. **Email**: manishpatel953249@gmail.com

---

**Made with ❤️ for your learning journey | Powered by Google Gemini AI**
