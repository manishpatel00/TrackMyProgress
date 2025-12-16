# 🎯 TrackMyProgress

> A modern web application to track your coding journey and learning progress with daily plans, session logging, and analytics.

**🔗 Live Demo:** [https://trackmyprogress.vercel.app](https://trackmyprogress.vercel.app)

---

## 🌟 Why TrackMyProgress?

Learning is most effective when progress is visible and repeatable. TrackMyProgress provides simple, opinionated workflows to plan daily study, log sessions, and review trends—helping learners stay consistent and make measurable progress.

Whether you're a student, self-learner, or professional developer, this platform turns your learning goals into trackable achievements.

---

## ✨ Key Features

### 📚 Core Learning Tools
- **Dashboard** - Overview of progress, quick actions, and activity highlights
- **Daily Plans** - Create and follow focused study plans with time tracking
- **Journey Log** - Chronological record of sessions, milestones, and notes
- **Statistics & Analytics** - Visual charts and summaries to surface learning trends

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Radix UI, Lucide Icons |
| **Backend** | FastAPI (Python 3.9+) |
| **Email** | SMTP (Gmail, Outlook, SendGrid) |
| **State Management** | React Context API |
| **Routing** | React Router v7 |
| **Deployment** | Vercel (Frontend), Custom (Backend) |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ with npm
- **Python** 3.9+
- **Gmail Account** (for email notifications - optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/manishpatel00/TrackMyProgress.git
cd trackmyprogress
```

2. **Install dependencies**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd server
python3 -m pip install -r requirements.txt
cd ..
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Backend Configuration
VITE_API_BASE=http://localhost:4000
PORT=4000

# Email Notifications (Optional)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
ADMIN_EMAIL=maishpatel953249@gmail.com
```

4. **Start the application**

**Option A: Using start script**
```bash
chmod +x start.sh
./start.sh
```

**Option B: Manual start (2 terminals)**

*Terminal 1 - Backend:*
```bash
cd server
python3 -m uvicorn ai_server:app --host 0.0.0.0 --port 4000 --reload
```

*Terminal 2 - Frontend:*
```bash
npm run dev
```

5. **Access the application**
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:4000](http://localhost:4000)
- **API Docs:** [http://localhost:4000/docs](http://localhost:4000/docs)

---

## 📁 Project Structure

```
trackmyprogress/
├── public/                        # Static assets
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx         # App header with navigation
│   │   │   └── Sidebar.tsx        # Sidebar navigation
│   │   ├── ui/                    # Reusable UI components
│   │   ├── ContactForm.tsx        # Contact form component
│   │   └── FeedbackForm.tsx       # Feedback form component
│   ├── pages/
│   │   ├── Dashboard.tsx          # Main dashboard
│   │   ├── DailyPlan.tsx          # Daily planning page
│   │   ├── JourneyLog.tsx         # Session logging page
│   │   ├── Stats.tsx              # Analytics page
│   │   └── Login.tsx              # Authentication page
│   ├── contexts/
│   │   ├── AuthContext.tsx        # Authentication state
│   │   ├── DataContext.tsx        # App data state
│   │   └── ThemeContext.tsx       # Theme management
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utilities and helpers
│   ├── types/                     # TypeScript type definitions
│   └── styles/                    # Global styles
├── server/
│   ├── ai_server.py               # FastAPI application
│   ├── email_service.py           # Email notification service
│   └── requirements.txt           # Python dependencies
├── .env                           # Environment variables
├── .gitignore                     # Git ignore rules
├── package.json                   # Node dependencies
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── README.md                      # This file
```

---

## 🔧 Available Scripts

### Frontend
```bash
npm run dev          # Start development server (port 5173)
npm run build        # Build production bundle
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Backend
```bash
# Development
python3 -m uvicorn ai_server:app --reload

# Production
gunicorn -w 4 -b 0.0.0.0:4000 server.ai_server:app
```

---

## 🔐 Setup Guides

### 📧 Gmail SMTP Setup

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Generate App Password**
   - Visit [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Name it "TrackMyProgress"
   - Copy the 16-character password

3. **Update `.env`**
```env
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
ADMIN_EMAIL=your-email@gmail.com
```

### 🌐 Other Email Providers

| Provider | SMTP Host | Port |
|----------|-----------|------|
| **Outlook** | smtp-mail.outlook.com | 587 |
| **Yahoo** | smtp.mail.yahoo.com | 587 |
| **SendGrid** | smtp.sendgrid.net | 587 |
| **Mailgun** | smtp.mailgun.org | 587 |

---

## 🚀 Deployment

### Deploy to Vercel (Frontend)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Configure build settings:
     - **Framework:** Vite
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

3. **Add Environment Variables**
   - Add `VITE_API_BASE` with your backend URL

### Deploy Backend

**Option 1: Render.com**
```bash
# Deploy as Web Service
# Build Command: pip install -r requirements.txt
# Start Command: gunicorn -w 4 -b 0.0.0.0:$PORT server.ai_server:app
```

**Option 2: Railway.app**
```bash
# Railway automatically detects FastAPI
# Add environment variables in dashboard
```

**Option 3: AWS/GCP/Azure**
- Use Docker or deploy directly with gunicorn
- Configure environment variables
- Set up HTTPS with SSL certificates

---

## 🐛 Troubleshooting

### Email Not Sending
- ✅ Verify Gmail 2FA is enabled
- ✅ Check App Password is correct (16 characters, no spaces)
- ✅ Confirm SMTP settings match your provider
- ✅ Check spam/junk folder for test emails

### Port Already in Use
```bash
# Find process using port
lsof -i :4000

# Kill the process
kill -9 <PID>

# Or use different port in .env
PORT=5000
```

### CORS Issues
- ✅ Backend must run on `http://localhost:4000`
- ✅ Frontend must run on `http://localhost:5173`
- ✅ Check `VITE_API_BASE` in `.env` matches backend URL
- ✅ Verify CORS settings in `ai_server.py`

### Build Fails on Vercel
- ✅ Ensure all dependencies in `package.json` are correct
- ✅ Check Node.js version compatibility
- ✅ Review build logs for specific errors
- ✅ Verify `vite.config.ts` is properly configured

---

## 🛡️ Security Features

✅ **No Client Secrets** - SMTP credentials never exposed to frontend  
✅ **Input Validation** - All form inputs sanitized  
✅ **CORS Protection** - Configured for specific origins  
✅ **Safe Error Messages** - No sensitive data in error responses  
✅ **Email Verification** - Confirmation emails for important actions

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- [x] Dashboard with progress overview
- [x] Daily planning system
- [x] Journey log for sessions
- [x] Basic analytics and charts
- [x] Authentication scaffold

### Phase 2: Enhanced Features 🚧
- [ ] Advanced analytics with insights
- [ ] Goal tracking with milestones
- [ ] Calendar integration (Google Calendar)
- [ ] External time tracker sync (Toggl, RescueTime)
- [ ] Pomodoro timer integration
- [ ] Spaced repetition reminders

### Phase 3: Collaboration 📋
- [ ] Share progress with peers
- [ ] Study group features
- [ ] Public learning profiles
- [ ] Leaderboards and achievements

### Phase 4: Production Hardening 📋
- [ ] Database migrations (PostgreSQL/MongoDB)
- [ ] Unit and integration tests
- [ ] CI/CD pipeline
- [ ] Performance monitoring
- [ ] OAuth providers (GitHub, Google)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feat/amazing-feature
   ```
3. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable
4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push to your fork**
   ```bash
   git push origin feat/amazing-feature
   ```
6. **Open a Pull Request**

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier rules
- Write meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

---

## 📚 Resources & Documentation

### Official Docs
- [FastAPI Documentation](https://fastapi.tiangolo.com/) - Backend framework
- [React Documentation](https://react.dev/) - Frontend library
- [Vite Documentation](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

---

## 👨‍💻 Author

**Manish Patel**

- GitHub: [@manishpatel](https://github.com/manishpatel00)
- Email: manishpatel953249@gmail.com
- Project: [TrackMyProgress](https://trackmyprogress.vercel.app)

---

## 📞 Support & Feedback

Need help or have suggestions? We'd love to hear from you!

- 📧 **Email:** manishpatel953249@gmail.com
- 💬 **Discussions:** Join our community discussions

---

## 🙏 Acknowledgments

Built with these amazing technologies:
- [React](https://react.dev/) - UI library
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Lucide Icons](https://lucide.dev/) - Beautiful icons
- [Vercel](https://vercel.com/) - Deployment platform

---

## ⭐ Star History

If you find this project helpful, please consider giving it a star on GitHub!

---

<div align="center">

**Made with ❤️ for learners everywhere**

[Live Demo](https://trackmyprogress.vercel.app) • [Report Bug](https://github.com/manishpatel/trackmyprogress/issues) • [Request Feature](https://github.com/manishpatel/trackmyprogress/issues)

</div>
