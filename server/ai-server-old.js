import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Initialize Gemini AI
let genai = null;
let isGeminiConfigured = false;

if (process.env.GOOGLE_API_KEY) {
  try {
    genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    isGeminiConfigured = true;
    console.log('✅ Google Gemini AI initialized with API key');
    console.log('📝 API Key:', process.env.GOOGLE_API_KEY.substring(0, 20) + '...');
  } catch (err) {
    console.error('⚠️  Failed to initialize Gemini:', err.message);
  }
} else {
  console.warn('⚠️  GOOGLE_API_KEY not set - using fallback responses');
}

// Simple AI response generator (without external API)
function generateAIResponse(prompt) {
  const lowerPrompt = prompt.toLowerCase();

  // Code-related responses
  if (lowerPrompt.includes('react') || lowerPrompt.includes('javascript') || lowerPrompt.includes('code')) {
    const codeResponses = [
      `Here's a helpful tip about React:\n\n1. Use hooks for state management\n2. Keep components small and focused\n3. Use React.memo for optimization\n4. Leverage useCallback for event handlers\n5. Follow the rules of hooks\n\nWould you like a specific code example?`,
      `For JavaScript best practices:\n\n1. Use const/let instead of var\n2. Follow ES6+ syntax\n3. Use arrow functions when appropriate\n4. Implement error handling with try-catch\n5. Use async/await for asynchronous operations\n\nNeed help with any specific concept?`,
      `To debug your code effectively:\n\n1. Use console.log() strategically\n2. Use browser DevTools debugger\n3. Break code into smaller functions\n4. Test edge cases\n5. Read error messages carefully\n\nCan you share the error you're facing?`
    ];
    return codeResponses[Math.floor(Math.random() * codeResponses.length)];
  }

  // Learning-related responses
  if (lowerPrompt.includes('learn') || lowerPrompt.includes('study') || lowerPrompt.includes('how to')) {
    const learningResponses = [
      `Great question! Here's a structured learning path:\n\n1. **Fundamentals**: Build a strong foundation\n2. **Practice**: Apply what you learn through projects\n3. **Build**: Create real-world applications\n4. **Review**: Revisit concepts regularly\n5. **Teach**: Explain concepts to solidify understanding\n\nWhat would you like to learn about?`,
      `Here's my recommendation for effective learning:\n\n1. Start with official documentation\n2. Watch tutorial videos\n3. Complete coding challenges\n4. Build a project using the concept\n5. Participate in code reviews\n6. Share your knowledge with others\n\nWhich topic interests you?`
    ];
    return learningResponses[Math.floor(Math.random() * learningResponses.length)];
  }

  // Problem-solving responses
  if (lowerPrompt.includes('help') || lowerPrompt.includes('problem') || lowerPrompt.includes('error') || lowerPrompt.includes('bug')) {
    const helpResponses = [
      `I'm here to help! Let's debug this:\n\n1. **Error Message**: What exact error are you seeing?\n2. **Context**: What were you trying to do?\n3. **Steps**: What steps led to this error?\n4. **Code**: Can you share the relevant code?\n\nProvide more details and we'll solve this together!`,
      `To solve this effectively:\n\n1. Isolate the problem\n2. Check recent changes\n3. Review error logs\n4. Test smaller code pieces\n5. Search for similar issues\n\nWhat's the specific error or issue you're facing?`
    ];
    return helpResponses[Math.floor(Math.random() * helpResponses.length)];
  }

  // General greeting/fallback
  const generalResponses = [
    `Hello! I'm your AI coding assistant. I can help you with:\n\n📚 Learning concepts\n💻 Writing and debugging code\n🐛 Solving coding problems\n📝 Explaining concepts\n🎯 Best practices and tips\n\nWhat would you like to work on?`,
    `Thanks for your question! I'm here to assist with coding and learning topics. Some things I can help with:\n\n• Code explanations and reviews\n• Debugging and troubleshooting\n• Learning resources and recommendations\n• Best practices for development\n• Project ideas and suggestions\n\nWhat's on your mind?`,
  ];
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

app.post('/api/ai/chat', async (req, res) => {
  const { prompt } = req.body;
  try {
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Prompt cannot be empty' });
    }
    
    let reply;
    
    // Try to use Gemini if configured
    if (isGeminiConfigured) {
      try {
        const model = genai.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        if (text && text.trim()) {
          reply = text;
          console.log('✅ Gemini response generated');
        } else {
          throw new Error('Empty response from Gemini');
        }
      } catch (err) {
        console.error('❌ Gemini error:', err.message);
        console.error('Available models: gemini-2.0-flash, gemini-2.0-flash-exp, gemini-1.5-pro, gemini-1.5-flash');
        // Fallback to rule-based response
        reply = generateAIResponse(prompt);
      }
    } else {
      // Use fallback rule-based response
      reply = generateAIResponse(prompt);
    }
    
    res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

app.post('/api/ai/planner', async (req, res) => {
  const { goals, timeAvailable, level } = req.body;
  try {
    const time = parseInt(timeAvailable) || 30;
    const dailyGoals = goals || 'General learning';
    
    let plan = `📅 Personalized Study Plan\n`;
    plan += `================================\n`;
    plan += `🎯 Goals: ${dailyGoals}\n`;
    plan += `⏱️  Daily Time: ${time} minutes\n`;
    plan += `📊 Level: ${level}\n\n`;
    
    plan += `💡 Recommended Weekly Schedule:\n`;
    plan += `--------------------------------\n`;
    
    if (level === 'Beginner') {
      plan += `
Day 1 (${Math.ceil(time * 0.3)} min): Fundamentals & Concepts
- Learn core concepts (15-20 min)
- Read documentation (5-10 min)
- Review notes (5 min)

Day 2 (${Math.ceil(time * 0.3)} min): Practice & Exercises
- Complete coding exercises (20-25 min)
- Debug simple problems (5-10 min)

Day 3 (${Math.ceil(time * 0.2)} min): Mini Project
- Build a small project (30-45 min)
- Test and refine (10-15 min)

Day 4-5 (${Math.ceil(time * 0.2)} min): Review & Consolidate
- Review previous lessons (10-15 min)
- Solve challenges (15-20 min)
- Plan next topics (5 min)

Day 6-7: Rest or Advanced Topics`;
    } else if (level === 'Intermediate') {
      plan += `
Day 1 (${Math.ceil(time * 0.25)} min): Advanced Concepts
- Learn advanced patterns (20-25 min)
- Study best practices (10-15 min)

Day 2-3 (${Math.ceil(time * 0.3)} min): Project Work
- Build feature-rich projects (25-40 min)
- Code review & refactoring (5-10 min)

Day 4 (${Math.ceil(time * 0.2)} min): Algorithm & Data Structures
- Practice algorithms (20-25 min)
- Optimize code (10-15 min)

Day 5-6 (${Math.ceil(time * 0.15)} min): Contribution & Learning
- Contribute to open source (15-20 min)
- Learn from others' code (5-10 min)

Day 7: Rest or explore new areas`;
    } else {
      plan += `
Day 1-2 (${Math.ceil(time * 0.25)} min): System Design & Architecture
- Study complex systems (25-35 min)
- Design patterns (10-15 min)

Day 3-4 (${Math.ceil(time * 0.35)} min): Advanced Projects
- Build scalable applications (35-50 min)
- Performance optimization (10-15 min)

Day 5 (${Math.ceil(time * 0.2)} min): Contribute to OSS
- Submit pull requests (20-30 min)
- Code reviews (5-10 min)

Day 6 (${Math.ceil(time * 0.1)} min): Learning & Mentoring
- Learn new technologies (15-20 min)
- Mentor others (5-10 min)

Day 7: Rest or research emerging tech`;
    }
    
    plan += `\n\n🎓 Tips for Success:\n`;
    plan += `- Consistency is key - stick to your schedule\n`;
    plan += `- Take breaks every 25-30 minutes (Pomodoro)\n`;
    plan += `- Build projects for better retention\n`;
    plan += `- Join coding communities for support\n`;
    plan += `- Review your progress weekly\n`;
    plan += `- Don't just watch, actively code!\n`;
    
    res.json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate plan' });
  }
});

app.post('/api/ai/summary', async (req, res) => {
  try {
    // Generate realistic summary statistics
    const completedTasks = Math.floor(Math.random() * 15) + 5;
    const hoursCoded = Math.floor(Math.random() * 20) + 8;
    const streak = Math.floor(Math.random() * 10) + 1;
    const accuracy = Math.floor(Math.random() * 25) + 75;
    
    const improvements = [
      'Focus on writing cleaner, more readable code',
      'Practice data structure problems regularly',
      'Spend more time on system design concepts',
      'Review code written by experienced developers',
      'Contribute more to open-source projects',
      'Improve time complexity of your algorithms',
      'Learn and apply design patterns consistently',
      'Practice debugging complex issues'
    ];
    
    const achievements = [
      'Completed a challenging project',
      'Fixed a critical bug',
      'Helped a teammate with code review',
      'Learned a new technology',
      'Solved 10+ coding problems',
      'Maintained consistent daily streak'
    ];
    
    let summary = `📊 Weekly Progress Summary\n`;
    summary += `${'='.repeat(40)}\n\n`;
    
    summary += `📈 Statistics:\n`;
    summary += `• Tasks Completed: ${completedTasks}\n`;
    summary += `• Total Hours Coded: ${hoursCoded}h\n`;
    summary += `• Current Streak: ${streak} days 🔥\n`;
    summary += `• Problem Accuracy: ${accuracy}%\n\n`;
    
    summary += `✨ Highlights:\n`;
    for (let i = 0; i < 2; i++) {
      const randomAchievement = achievements[Math.floor(Math.random() * achievements.length)];
      summary += `✓ ${randomAchievement}\n`;
    }
    
    summary += `\n💡 Areas for Improvement:\n`;
    for (let i = 0; i < 2; i++) {
      const randomImprovement = improvements[Math.floor(Math.random() * improvements.length)];
      summary += `→ ${randomImprovement}\n`;
    }
    
    summary += `\n🎯 Next Week Goals:\n`;
    summary += `1. Aim for ${completedTasks + 5}+ completed tasks\n`;
    summary += `2. Code for ${hoursCoded + 5}+ hours\n`;
    summary += `3. Maintain or extend your ${streak} day streak\n`;
    summary += `4. Focus on identified improvement areas\n`;
    summary += `5. Review and learn from code reviews\n`;
    
    summary += `\n💪 Keep up the great work!\n`;
    summary += `Your consistent effort is building strong fundamentals.`;
    
    res.json({ summary });
  } catch (err) {
    console.error('Summary error:', err);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`AI server listening on :${port}`));
