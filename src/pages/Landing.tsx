import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, ArrowRight, Check, Zap } from 'lucide-react';
import {
  LayoutDashboard,
  CalendarCheck,
  NotebookPen,
  TrendingUp,
} from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 h-64 w-64 bg-primary/20 rounded-full blur-[150px] opacity-50 dark:opacity-20 -z-10" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 bg-blue-500/10 rounded-full blur-[150px] -z-10" />

      <div className="container mx-auto px-3 py-5">

        {/* LOGO & SIGN IN (Added sign-in button for functionality) */}
        <header className="flex justify-between items-center mb-16">
          <BrandLogo className="h-15 md:h-16 " />
          <Link to="/login">
            <Button variant="ghost" className=" inline-flex items-center gap-2 mb-5 rounded-full bg-primary/10 px-4 py-1 text-sm font-bold text-primary border border-primary/20">Sign In</Button>
          </Link>
        </header>

        {/* HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 mb-5 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary border border-primary/20">
            <Zap className="h-4 w-4" /> Accelerate your skills with intelligence
          </span>

          <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight mb-6 leading-snug">
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Master Consistency,
            </span>
            Track Progress, Achieve Goals.
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            The structured platform that guides your learning journey, turning effort into measurable, sustainable growth.
          </p>

          <div className="flex justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="px-10 text-lg shadow-lg shadow-primary/30">
                Get Started Free
              </Button>
            </Link>
            <a href="#features">
              <Button variant="link" size="lg" className="text-lg group">
                See Features <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </a>
          </div>
        </section>

        {/* VISUAL SECTION (Mock Dashboard) */}
        <section className="flex justify-center mb-24">
          <div className="relative max-w-5xl w-full p-2">
            {/* Mock Dashboard Card */}
            <div className="rounded-3xl border bg-card/70 backdrop-blur-lg p-6 md:p-10 shadow-2xl dark:shadow-primary/10">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Left: AI Brain */}
                <div className="w-full md:w-1/3 text-center">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 blur-3xl bg-primary/30 rounded-full animate-pulse" />
                    <Brain className="relative h-24 w-24 md:h-32 md:w-32 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mt-4"> </h3>
                  <p className="text-sm text-muted-foreground mt-1">Personalized guidance.</p>
                </div>

                {/* Right: Mock Progress Chart/Data */}
                <div className="w-full md:w-2/3 space-y-4">
                  <h4 className="text-xl font-semibold border-b pb-2">Your Weekly Summary</h4>
                  
                  <ProgressStat title="Consistency Streak" value="18 Days" icon={<Check className="h-5 w-5 text-green-500" />} />
                  <ProgressStat title="Topics Mastered" value="12 New Skills" icon={<TrendingUp className="h-5 w-5 text-blue-500" />} />
                  
                  <Button size="sm" className="w-full mt-4">View Full Analytics Dashboard</Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="max-w-6xl mx-auto py-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything You Need to Scale Your Skills
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            From planning your daily study sessions to analyzing long-term growth.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              to="/dashboard"
              icon={<LayoutDashboard />}
              title="Intuitive Dashboard"
              description="A quick, real-time snapshot of your progress, streaks, and next actions."
            />
            <FeatureCard
              to="/daily-plan"
              icon={<CalendarCheck />}
              title="Actionable Daily Plans"
              description="Automatic daily goal generation to keep you focused and accountable."
            />
            <FeatureCard
              to="/journey-log"
              icon={<NotebookPen />}
              title="Detailed Learning Log"
              description="Document your 'Aha!' moments, track milestones, and easily search history."
            />
            <FeatureCard
              to="/stats"
              icon={<TrendingUp />}
              title="Quantifiable Statistics"
              description="Visual charts and data to prove your growth and identify areas for optimization."
            />
          </div>
        </section>

      </div>
    </div>
  );
}

/* -----------------------------
   SUPPORT COMPONENTS
--------------------------------*/

// New component for the visual section stats
function ProgressStat({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-background/50 border">
            <div className="flex items-center space-x-3">
                {icon}
                <p className="font-medium text-sm md:text-base">{title}</p>
            </div>
            <p className="font-bold text-lg text-primary">{value}</p>
        </div>
    );
}


// Existing FeatureCard, updated for better hover effect and padding
function FeatureCard({
  to = '#',
  icon,
  title,
  description,
}: {
  to?: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border bg-card/60 p-6 backdrop-blur-sm
                 transition-all duration-300 relative
                 hover:-translate-y-1 hover:shadow-2xl dark:hover:shadow-primary/20 hover:border-primary/50"
    >
      {/* Hover Border Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-primary/5 bg-primary/5" />

      <div className="flex flex-col items-start gap-4 relative z-10">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-xl
                     bg-primary/5 text-primary
                     transition-all duration-300
                     group-hover:bg-primary/15"
        >
          {React.cloneElement(icon as React.ReactElement, {
            className: 'h-7 w-7',
          })}
        </div>

        <div>
          <h4 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}