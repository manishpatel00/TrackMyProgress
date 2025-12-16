# TrackMyProgress

A concise learning and productivity tracker for students, self-learners and developers.

## Why this project exists

Learning is most effective when progress is visible and repeatable. TrackMyProgress provides simple, opinionated workflows to plan daily study, log sessions, and review trends so learners can stay consistent and make measurable progress.

## Key features

- Daily plans: create and follow focused study plans.
- Session logging: record time, notes, and outcomes for each study session.
- Journey log: keep a chronological record of milestones and notes.
- Basic analytics: simple charts and summaries to surface trends.
- Authentication scaffold: client + FastAPI backend with session handling.
- Feedback & contact forms with optional email notifications.
- AI-ready architecture: hooks and interfaces prepared for future smart insights (planned).

## Tech stack

- Frontend: React 18, TypeScript, Vite
- Styling: Tailwind CSS
- Backend: FastAPI (Python)
- Database / Auth: pluggable — current code includes backend stubs (optional)

## Project structure

```
.
├── public/
├── server/
│   ├── ai_server.py        # FastAPI backend (development)
│   ├── email_service.py    # Simple SMTP helper (optional)
│   └── requirements.txt
├── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   └── styles/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Getting started

1. Install dependencies:

```
npm install
python3 -m pip install -r server/requirements.txt
```

2. Configure environment (see below).

3. Start the app (two terminals):

```
# Backend
cd server
python3 -m uvicorn ai_server:app --reload

# Frontend
npm run dev
```

4. Open the frontend at `http://localhost:5173`.

## Environment variables (example)

Create a `.env` in the project root or set these in your environment. Do not commit secrets.

```
# Frontend
VITE_API_BASE=http://localhost:4000

# Backend
PORT=4000

# Optional: email notifications
SMTP_USER=you@example.com
SMTP_PASSWORD=your-smtp-password
SMTP_HOST=smtp.example.com
SMTP_PORT=587
```

## Development scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build production bundle
- `npm run preview` — preview production build locally
- `npm run lint` — run linter
- `npm run format` — format code

Backend (development):

```
python3 -m uvicorn ai_server:app --reload
```

## Roadmap / planned features

- Improved analytics and goal tracking.
- AI features (planned): smart insights, automated summaries, study recommendations — architecture is AI-ready but features are coming soon.
- Integrations: calendar sync, external time trackers, OAuth providers.
- Production hardening: DB migrations, tests, CI/CD.

## Screenshots

Placeholders: add screenshots or animated GIFs showing the dashboard, daily plan, and journey log here.

## Contribution guidelines

- Open an issue to discuss larger changes before implementing them.
- Use feature branches named `feat/<short-description>` or `fix/<short-description>`.
- Keep commits small and focused; write clear commit messages.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Author / contact

Manish Patel — https://github.com/manishpatel

Feedback, bug reports and pull requests are welcome.
# 🎯 TrackMyProgress — Learning Tracker

A modern web application to track your coding journey and learning progress with daily plans, session logging, and analytics.

## ✨ What's Included

### 📧 Communication Features
- **Login Notifications** - Email alerts when you sign in
- **Feedback System** - Send suggestions directly to the team
- **Contact Forms** - Easy support request system

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ with npm
- Python 3.9+

### Installation

1. **Clone the repository**
```bash
cd coding-journey-tracker
```

2. **Install dependencies**
```bash
npm install
python3 -m pip install -r server/requirements.txt
```

3. **Configure `.env`** (optional)
```env
# Optional (Email notifications)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
ADMIN_EMAIL=your-email@gmail.com

# Backend
VITE_API_BASE=http://localhost:4000
PORT=4000
```

4. **Start Application**

**Option A: Using start script**
```bash
chmod +x start.sh
./start.sh
```

**Option B: Manual (2 terminals)**

Terminal 1 - Backend:
```bash
cd server
python3 -m uvicorn ai_server:app --host 0.0.0.0 --port 4000
```

Terminal 2 - Frontend:
```bash
npm run dev
```

5. **Open in Browser**
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000

---

## 📖 Documentation

- **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** - Comprehensive setup guide
- **[INTEGRATION_COMPLETE.md](INTEGRATION_COMPLETE.md)** - Integration details

---

## 🎨 Features in Detail

### Core App
- **Dashboard** - Overview of progress, quick actions, and highlights
- **Daily Plan** - Create and follow daily learning plans
- **Journey Log** - Record sessions, notes, and milestones
- **Statistics** - Charts and analytics of your activity

### Forms & Feedback
- Contact form with email confirmation
- Feedback submission system
- Email notifications to admin

---
## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server (5173)

# Building
npm run build        # Build production bundle
npm run preview      # Preview production build

# Quality
npm run lint         # Run linter
npm run format       # Format code

# Server
python3 -m uvicorn ai_server:app --reload  # Dev server
```

---

## 📦 Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── ai/
│   │   │   ├── AIChat.tsx              ← ChatGPT-like chat
│   │   │   ├── AIPlanner.tsx           ← Study planner
│   │   │   └── AISummary.tsx           ← Progress summary
│   │   ├── ContactForm.tsx             ← Contact form
│   │   ├── FeedbackForm.tsx            ← Feedback form
│   │   ├── layout/
│   │   └── ui/
│   ├── pages/
│   │   ├── AIChatPage.tsx
│   │   ├── AIPlannerPage.tsx
│   │   ├── AISummaryPage.tsx
│   │   ├── AIToolsHub.tsx              ← AI hub
│   │   ├── Dashboard.tsx
│   │   ├── DailyPlan.tsx
│   │   ├── JourneyLog.tsx
│   │   ├── Stats.tsx
│   │   └── Login.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   ├── DataContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   ├── lib/
│   └── types/
├── server/
│   ├── ai_server.py                    ← FastAPI server
│   ├── email_service.py                ← Email notifications
│   └── requirements.txt
├── .env                                ← Configuration
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Radix UI |
| **Backend** | FastAPI, Python 3.9+ |
| **AI Model** | Google Gemini 2.5 Flash |
| **Email** | SMTP (Gmail, Outlook, etc.) |
| **State** | React Context API |
| **Routing** | React Router v7 |

---

## 🔐 Security

✅ **Features**
- No sensitive data in browser
- API keys in backend only
- SMTP passwords never exposed
- Input validation on forms
- CORS protection enabled
- Error messages safe

---

## 📧 Email Setup

### Gmail (Recommended)

1. Enable 2FA at [myaccount.google.com/security](https://myaccount.google.com/security)
2. Get App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Update `.env`:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=16-char-app-password
```

### Other Services
- Outlook: `smtp-mail.outlook.com`
- SendGrid: `smtp.sendgrid.net`
- Mailgun: `smtp.mailgun.org`

---

## 🐛 Troubleshooting

### AI Service Errors (500)
- Verify API key at https://ai.google.dev
- Check backend running on :4000
- See server logs for details

### Email Not Sending
- Verify SMTP credentials
- Check Gmail 2FA & app password
- Confirm email in `.env`

### Port Already in Use
```bash
lsof -i :4000  # Find process
kill -9 <PID>  # Kill it
```

### CORS Issues
- Backend must be on http://localhost:4000
- Frontend must be on http://localhost:5173
- Check `VITE_API_BASE` in `.env`

---

## 📞 Support

**Email**: manishpatel953249@gmail.com

Use the in-app feedback form or contact directly for:
- Bug reports
- Feature requests
- Questions
- General support

---

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

Output in `/dist` directory

### Deploy Backend
```bash
gunicorn -w 4 -b 0.0.0.0:4000 server.ai_server:app
```

### Environment Variables
Set in your hosting platform:
- `GOOGLE_API_KEY`
- `SMTP_*` (if using email)
- `VITE_API_BASE`

---

## 📚 Resources

- [Gemini API Docs](https://ai.google.dev/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)

---

## 📝 License

MIT - Use freely for personal and commercial projects

---

**Made with ❤️ for learners | Powered by Google Gemini AI**
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
