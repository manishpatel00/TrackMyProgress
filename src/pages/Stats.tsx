import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, ClipboardList, BarChart2, Trophy, Code, Sparkles, Search } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { PageTitle } from '@/components/ui/PageTitle';
import { useData } from '@/contexts/DataContext';
import { formatMinutesToTime } from '@/lib/utils';

// Custom colors for charts
const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

interface StatsPageProps {}

export default function StatsPage({}: StatsPageProps) {
  const { plans, journalEntries, stats } = useData();
  const [period, setPeriod] = useState<'all' | 'month' | 'week'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter data based on selected period
  const getFilteredData = () => {
    const now = new Date();

    if (period === 'all') {
      return {
        plans: [...plans],
        entries: [...journalEntries]
      };
    }

    const cutoffDate = new Date();
    if (period === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else if (period === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    }

    return {
      plans: plans.filter(plan => new Date(plan.date) >= cutoffDate),
      entries: journalEntries.filter(entry => new Date(entry.date) >= cutoffDate)
    };
  };

  const { plans: filteredPlans, entries: filteredEntries } = getFilteredData();

  // Apply search filtering if search query exists
  const searchFilteredTechnologies = searchQuery
    ? Object.entries(stats.topTechnologies)
        .filter(([tech]) => tech.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => b[1] - a[1])
    : Object.entries(stats.topTechnologies).sort((a, b) => b[1] - a[1]);

  // Calculate stats for the filtered data
  const calculateFilteredStats = () => {
    let totalTimeSpent = 0;
    let tasksCompleted = 0;
    let totalTasks = 0;
    const technologies: Record<string, number> = {};
    const daysTracked = new Set<string>();

    // Process journal entries
    filteredEntries.forEach(entry => {
      totalTimeSpent += entry.timeSpent;
      daysTracked.add(entry.date.split('T')[0]);

      entry.technologiesUsed.forEach(tech => {
        technologies[tech] = (technologies[tech] || 0) + 1;
      });
    });

    // Process plans
    filteredPlans.forEach(plan => {
      daysTracked.add(plan.date.split('T')[0]);
      totalTasks += plan.tasks.length;
      tasksCompleted += plan.tasks.filter(task => task.completed).length;
    });

    // Calculate average time per coding day
    const avgTimePerDay = daysTracked.size > 0
      ? Math.round(totalTimeSpent / daysTracked.size)
      : 0;

    // Sort technologies by frequency
    const topTechnologies = Object.entries(technologies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Task completion rate
    const completionRate = totalTasks > 0
      ? Math.round((tasksCompleted / totalTasks) * 100)
      : 0;

    return {
      daysTracked: daysTracked.size,
      totalTimeSpent,
      avgTimePerDay,
      tasksCompleted,
      totalTasks,
      completionRate,
      topTechnologies,
    };
  };

  const filteredStats = calculateFilteredStats();

  // Calculate activity by day of week
  const calculateDayOfWeekActivity = () => {
    const dayStats = [
      { name: 'Sunday', minutes: 0, count: 0 },
      { name: 'Monday', minutes: 0, count: 0 },
      { name: 'Tuesday', minutes: 0, count: 0 },
      { name: 'Wednesday', minutes: 0, count: 0 },
      { name: 'Thursday', minutes: 0, count: 0 },
      { name: 'Friday', minutes: 0, count: 0 },
      { name: 'Saturday', minutes: 0, count: 0 },
    ];

    filteredEntries.forEach(entry => {
      const date = new Date(entry.date);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday

      dayStats[dayOfWeek].minutes += entry.timeSpent;
      dayStats[dayOfWeek].count += 1;
    });

    return dayStats;
  };

  const dayOfWeekStats = calculateDayOfWeekActivity();
  const maxDayMinutes = Math.max(...dayOfWeekStats.map(day => day.minutes));

  // Get most productive day
  const getMostProductiveDay = () => {
    const mostMinutes = Math.max(...dayOfWeekStats.map(day => day.minutes));
    return dayOfWeekStats.find(day => day.minutes === mostMinutes);
  };

  const mostProductiveDay = getMostProductiveDay();

  // Calculate recent victories
  const getRecentVictories = () => {
    return filteredEntries
      .flatMap(entry => entry.victories.map(victory => ({
        victory,
        date: entry.date
      })))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
  };

  const recentVictories = getRecentVictories();

  // Extract month names and total coding time for chart
  const getMonthlyActivity = () => {
    const monthlyData: Record<string, number> = {};

    journalEntries.forEach(entry => {
      const date = new Date(entry.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + entry.timeSpent;
    });

    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([month, minutes]) => ({ name: month, minutes }))
      .sort((a, b) => {
        // Extract month and year
        const [aMonth, aYear] = a.name.split(' ');
        const [bMonth, bYear] = b.name.split(' ');

        // Compare year first
        if (aYear !== bYear) {
          return parseInt(aYear) - parseInt(bYear);
        }

        // If same year, compare month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.indexOf(aMonth) - months.indexOf(bMonth);
      })
      .slice(-6); // Get last 6 months
  };

  const monthlyActivity = getMonthlyActivity();

  // Prepare data for technology pie chart
  const prepareTechPieData = () => {
    return Object.entries(stats.topTechnologies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  };

  const techPieData = prepareTechPieData();

  return (
    <div className="transition-all duration-300 ease-in-out">
      <PageTitle
        title="Statistics"
        description="Track your coding progress and achievements"
      >
        <div className="flex items-center gap-2 transition-all duration-300">
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>
      </PageTitle>

      <div className="mb-6">
        <Tabs value={period} onValueChange={(value) => setPeriod(value as 'all' | 'month' | 'week')}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All Time</TabsTrigger>
            <TabsTrigger value="month">Last 30 Days</TabsTrigger>
            <TabsTrigger value="week">Last 7 Days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 transition-all duration-300">
        {/* Coding Days */}
        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              Coding Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStats.daysTracked}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {period === 'all'
                ? 'Total days with activity'
                : period === 'month'
                ? 'Days coded in last 30 days'
                : 'Days coded in last 7 days'}
            </p>
          </CardContent>
        </Card>

        {/* Time Coded */}
        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Time Coded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatMinutesToTime(filteredStats.totalTimeSpent)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg: {formatMinutesToTime(filteredStats.avgTimePerDay)} per day
            </p>
          </CardContent>
        </Card>

        {/* Tasks Completed */}
        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <ClipboardList className="h-4 w-4 mr-1" />
              Tasks Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStats.tasksCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredStats.completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="transition-all duration-300 hover:shadow-lg hover:scale-105">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <Trophy className="h-4 w-4 mr-1" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streakDays} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep up the consistent work!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Activity Chart */}
      <Card className="mt-6 transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">Monthly Coding Activity</CardTitle>
          <CardDescription>
            Hours spent coding per month
          </CardDescription>
        </CardHeader>
        <CardContent>
          {monthlyActivity.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                  <YAxis
                    stroke="hsl(var(--foreground))"
                    label={{
                      value: 'Minutes',
                      angle: -90,
                      position: 'insideLeft',
                      style: { fill: 'hsl(var(--muted-foreground))' }
                    }}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [formatMinutesToTime(value), 'Time Spent']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Bar dataKey="minutes" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-80 text-center text-muted-foreground">
              <div>
                <BarChart2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Not enough data to display monthly activity.</p>
                <p className="text-sm mt-1">Log your coding sessions to see your progress over time.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        {/* Day of Week Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity by Day of Week</CardTitle>
            <CardDescription>
              When you code the most
            </CardDescription>
          </CardHeader>
          <CardContent>
            {maxDayMinutes > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dayOfWeekStats}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      type="number"
                      stroke="hsl(var(--foreground))"
                      label={{
                        value: 'Minutes',
                        position: 'insideBottom',
                        offset: -5,
                        style: { fill: 'hsl(var(--muted-foreground))' }
                      }}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="hsl(var(--foreground))"
                      width={80}
                    />
                    <RechartsTooltip
                      formatter={(value: number) => [formatMinutesToTime(value), 'Time Spent']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                    <Bar dataKey="minutes" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-center text-muted-foreground">
                <div>
                  <BarChart2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Not enough data to display activity patterns.</p>
                </div>
              </div>
            )}

            {mostProductiveDay && mostProductiveDay.minutes > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm">
                  Your most productive day is <span className="font-medium">{mostProductiveDay.name}</span> with an average of {formatMinutesToTime(mostProductiveDay.minutes / (mostProductiveDay.count || 1))} per session.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technology Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Technology Distribution</CardTitle>
            <CardDescription>
              Most frequently used technologies
            </CardDescription>
          </CardHeader>
          <CardContent>
            {techPieData.length > 0 ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={techPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => entry.name}
                    >
                      {techPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                    <RechartsTooltip
                      formatter={(value: number, name: string) => [`Used ${value} times`, name]}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 text-center text-muted-foreground">
                <div>
                  <Code className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No technologies logged yet.</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Technologies List with Search */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-lg">All Technologies</CardTitle>
              <CardDescription>
                Complete list of technologies you've used
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search technologies..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {searchFilteredTechnologies.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {searchFilteredTechnologies.map(([tech, count]) => (
                <div key={tech} className="flex justify-between items-center p-2 border rounded-md">
                  <span className="font-medium">{tech}</span>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {count} {count === 1 ? 'time' : 'times'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? `No technologies match "${searchQuery}"`
                : "No technologies have been logged yet."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Victories */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Recent Victories</CardTitle>
          <CardDescription>
            Your coding achievements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentVictories.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {recentVictories.map((item, index) => (
                <div key={index} className="flex border rounded-md p-3">
                  <Sparkles className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>{item.victory}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8 text-center text-muted-foreground">
              <div>
                <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No victories logged yet.</p>
                <p className="text-xs mt-1">
                  Log your accomplishments as you make progress!
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
