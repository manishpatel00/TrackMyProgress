# AI Tools Setup Guide - Google Gemini Integration

This project uses Google's Gemini AI API to power the AI tools. Follow these steps to get started.

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Google Account (for Gemini API key)

## Setup Instructions

### Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Create API Key" 
3. Copy your API key

### Step 2: Configure Environment Variables

1. Open `.env` file in the project root
2. Replace `your-gemini-api-key-here` with your actual API key:

```env
GOOGLE_API_KEY=your-actual-api-key-here
```

### Step 3: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
python3 -m pip install -r server/requirements.txt
```

### Step 4: Run the Application

#### Option A: Using the startup script (recommended)

```bash
chmod +x start.sh
./start.sh
```

#### Option B: Manual startup

Terminal 1 - Start the AI server:
```bash
cd server
python3 -m uvicorn ai_server:app --host 0.0.0.0 --port 4000
```

Terminal 2 - Start the React app:
```bash
npm run dev
```

### Step 5: Access the Application

- Frontend: http://localhost:5173
- API Server: http://localhost:4000

## Features

### AI Chat
Ask the AI assistant questions, get code help, or troubleshooting assistance.
- **Endpoint**: `POST /api/ai/chat`
- **Request**: `{ "prompt": "Your question here" }`

### AI Planner
Get personalized study plans based on your goals and available time.
- **Endpoint**: `POST /api/ai/planner`
- **Request**: `{ "goals": "...", "timeAvailable": "30", "level": "Beginner" }`

### AI Summary
Generate summaries of your learning progress with suggestions for improvement.
- **Endpoint**: `POST /api/ai/summary`
- **Request**: `{ "data": { /* your progress data */ } }`

## Troubleshooting

### "Generative SDK not available" error
- Ensure `GOOGLE_API_KEY` is set in `.env`
- Check that `google-generativeai` is installed: `pip list | grep google`

### API Key errors
- Verify your API key is valid at https://ai.google.dev/
- Ensure the key has sufficient quota

### Connection refused
- Make sure the Python server is running on port 4000
- Check `VITE_API_BASE` in `.env` matches your server URL

## Technologies Used

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Python 3 + FastAPI
- **AI Model**: Google Gemini
- **Styling**: Tailwind CSS

## Project Structure

```
.
├── src/                    # React components and pages
│   ├── components/ai/      # AI tool components
│   │   ├── AIChat.tsx
│   │   ├── AIPlanner.tsx
│   │   └── AISummary.tsx
│   └── pages/              # Page components
├── server/                 # Python backend
│   ├── ai_server.py        # FastAPI server
│   └── requirements.txt     # Python dependencies
├── .env                    # Environment configuration
└── package.json            # Node.js dependencies
```

## API Reference

### Chat Endpoint
```bash
curl -X POST http://localhost:4000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "How do I learn React?"}'
```

### Planner Endpoint
```bash
curl -X POST http://localhost:4000/api/ai/planner \
  -H "Content-Type: application/json" \
  -d '{
    "goals": "Learn React and TypeScript",
    "timeAvailable": "60",
    "level": "Intermediate"
  }'
```

### Summary Endpoint
```bash
curl -X POST http://localhost:4000/api/ai/summary \
  -H "Content-Type: application/json" \
  -d '{"data": {"completedLessons": 5, "hoursSpent": 10}}'
```

## Notes

- Keep your API key secret and never commit `.env` to version control
- Monitor your API usage at https://ai.google.dev/
- The Gemini API has rate limits; adjust requests accordingly

## Support

For issues with:
- **Gemini API**: See https://ai.google.dev/docs
- **FastAPI**: See https://fastapi.tiangolo.com/
- **React/Vite**: See https://vitejs.dev/

---

**Happy coding with AI-powered learning! 🚀**
