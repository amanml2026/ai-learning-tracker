# AI Learning Tracker 🚀

An intelligent learning tracker powered by **Google Gemini AI**. Track your courses, practice DSA problems, manage coaching notes, and get AI-powered insights on your learning progress.

## ✨ Features

- 📚 **Course Management** - Organize and track your courses with progress updates
- 💻 **DSA Practice** - Practice Data Structures & Algorithms problems
- 📝 **Coaching Notes** - Keep organized notes from mentors and coaches
- 🤖 **AI Insights** - Get intelligent recommendations using Google Gemini API
- 📊 **Dashboard** - Visual overview of your learning journey
- 🎯 **Progress Tracking** - Monitor your improvement over time

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: Express.js
- **AI**: Google Gemini API (@google/genai)
- **Styling**: Tailwind CSS
- **Components**: Lucide React Icons
- **Charts**: Recharts

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API Key ([Get one here](https://ai.google.dev/))

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-learning-tracker.git
cd ai-learning-tracker
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env` and add your credentials:

```
GEMINI_API_KEY=your_actual_gemini_api_key_here
APP_URL=http://localhost:3000
```

### 4. Run Locally

**Development mode:**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

Start the production server:
```bash
npm start
```

## 📂 Project Structure

```
ai-learning-tracker/
├── src/
│   ├── components/
│   │   ├── DashboardView.tsx    # Main dashboard
│   │   ├── CourseView.tsx       # Course management
│   │   ├── DsaView.tsx          # DSA practice
│   │   ├── CoachView.tsx        # Coaching notes
│   │   └── NotesView.tsx        # Notes management
│   ├── utils/
│   │   └── db.ts                # Database utilities
│   ├── types.ts                 # TypeScript type definitions
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── server.ts                     # Express server
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## 🔐 Security Notes

- **Never commit `.env` files** - Use `.env.example` as a template
- **API Keys are environment variables only** - Keep them secure
- All sensitive files are properly gitignored

## 🎨 Features Details

### Dashboard View
- Real-time overview of learning progress
- Quick stats and achievement badges
- Recent activity feed

### Course Management
- Add and track multiple courses
- Set learning goals and deadlines
- Monitor completion percentage

### DSA Practice
- Track DSA problem-solving progress
- Organize by topics
- Monitor improvement patterns

### Coaching Notes
- Store notes from coaching sessions
- Organize by coach/mentor
- Quick reference lookup

### AI-Powered Insights
- Get personalized learning recommendations
- Analyze your learning patterns
- Get study tips from Google Gemini AI

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

If you encounter any issues:
1. Check the [Issues](https://github.com/yourusername/ai-learning-tracker/issues) page
2. Create a new issue with a clear description
3. Include screenshots or error logs if applicable

## 🎓 Learn More

- [Google Gemini API Documentation](https://ai.google.dev/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Express.js Documentation](https://expressjs.com/)

## 📌 Roadmap

- [ ] User authentication
- [ ] Data persistence with database
- [ ] Mobile app version
- [ ] Collaborative learning features
- [ ] Advanced analytics dashboard
- [ ] Study group functionality

---

Made with ❤️
