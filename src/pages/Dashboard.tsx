import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ClipboardList, Clock, Sparkles, Trophy, BookOpen, MessageSquare, LayoutGrid, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/ui/PageTitle';
import { useData } from '@/contexts/DataContext';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from '@/lib/utils';
import { exportUserData } from '@/lib/export';

interface DashboardPageProps {
  setExportCallback?: (callback: () => void) => void;
}

export default function DashboardPage({ setExportCallback }: DashboardPageProps) {
  const { plans, journalEntries, stats, getTasksForDate, getJournalForDate, getPlanForDate } = useData();
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const todaysPlan = getPlanForDate(currentDate);
  const todaysJournal = getJournalForDate(currentDate);

  useEffect(() => {
    const tasks = getTasksForDate(currentDate);
    setTotalTasks(tasks.length);
    setCompletedTasks(tasks.filter(task => task.completed).length);
  }, [currentDate, getTasksForDate, plans]);

  // Set up export data callback
  useEffect(() => {
    if (setExportCallback) {
      setExportCallback(() => handleExportData);
    }
  }, [plans, journalEntries, stats, setExportCallback]);

  const handleExportData = () => {
    exportUserData(plans, journalEntries, stats);
  };

  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const lastJournalEntry = journalEntries.length > 0
    ? journalEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
    : null;

  const topTechnologies = Object.entries(stats.topTechnologies).slice(0, 3);

  return (
    <div className="transition-all duration-300 ease-in-out">
      <PageTitle
        title="Dashboard"
        description="Overview of your coding journey and daily plan"
      >
        <div className="flex gap-2 transition-all duration-300">
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link to="/daily-plan">
              <ClipboardList className="h-4 w-4 mr-2" />
              Create Plan
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <Link to="/journey-log">
              <BookOpen className="h-4 w-4 mr-2" />
              Log Journey
            </Link>
          </Button>
        </div>
      </PageTitle>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-all duration-300">
        {/* Daily Progress */}
        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Progress</CardTitle>
            <CardDescription>
              {totalTasks > 0
                ? `${completedTasks} of ${totalTasks} tasks completed`
                : "No tasks planned for today"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="h-2" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-2xl font-bold">{completedTasks}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Remaining</span>
                <span className="text-2xl font-bold">{totalTasks - completedTasks}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full "
              asChild
            >
              <Link to="/daily-plan">
                {todaysPlan ? 'View Today\'s Plan' : 'Create Today\'s Plan'}
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Streak */}
        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Current Streak</CardTitle>
            <CardDescription>Keep the momentum going!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <Trophy className="h-8 w-8 text-yellow-500 mr-2" />
              <span className="text-4xl font-bold">{stats.streakDays}</span>
              <span className="ml-2 text-lg">days</span>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {stats.streakDays > 0
                ? "Keep coding daily to maintain your streak!"
                : "Start your streak by logging your first day!"
              }
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full"
              asChild
            >
              <Link to="/stats">
                View All Stats
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Total Stats */}
        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Journey</CardTitle>
            <CardDescription>Overall coding statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2 text-primary" />
                  <span>Days Tracked</span>
                </div>
                <span className="font-medium">{stats.totalDaysTracked}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <span>Hours Coded</span>
                </div>
                <span className="font-medium">{Math.round(stats.totalTimeSpent / 60)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ClipboardList className="h-5 w-5 mr-2 text-primary" />
                  <span>Tasks Completed</span>
                </div>
                <span className="font-medium">{stats.tasksCompleted}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full"
              asChild
            >
              <Link to="/stats">
                View Details
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-2 lg:col-span-2 transition-all duration-300 hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Your latest coding activities</CardDescription>
          </CardHeader>
          <CardContent>
            {lastJournalEntry ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {new Date(lastJournalEntry.date).toLocaleDateString()}
                    <span className="text-muted-foreground ml-2 text-sm">
                      ({formatDistanceToNow(new Date(lastJournalEntry.date))})
                    </span>
                  </h4>

                  <div className="mt-2 grid gap-3 md:grid-cols-2">
                    <div>
                      <h5 className="text-sm font-medium">Technologies Used</h5>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lastJournalEntry.technologiesUsed.map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium">Time Spent</h5>
                      <p className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {Math.floor(lastJournalEntry.timeSpent / 60)} hours {lastJournalEntry.timeSpent % 60} minutes
                      </p>
                    </div>
                  </div>

                  {lastJournalEntry.victories.length > 0 && (
                    <div className="mt-2">
                      <h5 className="text-sm font-medium flex items-center">
                        <Sparkles className="h-4 w-4 mr-1 text-yellow-500" />
                        Victories
                      </h5>
                      <ul className="mt-1 list-disc list-inside text-sm">
                        {lastJournalEntry.victories.slice(0, 2).map((victory, i) => (
                          <li key={i}>{victory}</li>
                        ))}
                        {lastJournalEntry.victories.length > 2 && (
                          <li className="text-muted-foreground">
                            +{lastJournalEntry.victories.length - 2} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No journal entries yet. Start logging your coding journey!</p>
                <Button
                  className="mt-4"
                  asChild
                >
                  <Link to="/journey-log">
                    Create Your First Log
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full"
              asChild
            >
              <Link to="/journey-log">
                {lastJournalEntry ? 'View All Entries' : 'Create Entry'}
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Top Technologies */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Top Technologies</CardTitle>
            <CardDescription>What you use most frequently</CardDescription>
          </CardHeader>
          <CardContent>
            {topTechnologies.length > 0 ? (
              <div className="space-y-3">
                {topTechnologies.map(([tech, count]) => (
                  <div key={tech}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{tech}</span>
                      <span className="text-sm text-muted-foreground">Used {count} times</span>
                    </div>
                    <Progress value={(count / Object.values(stats.topTechnologies)[0]) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p>No technologies logged yet.</p>
                <p className="text-sm mt-1">
                  Log your coding sessions to track which technologies you use most frequently.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full"
              asChild
            >
              <Link to="/stats">
                View All Technologies
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* AI Tools removed */}
      </div>
    </div>
  );
}
