import React, { createContext, useContext, useEffect, useState } from 'react';
import { DailyPlan, JournalEntry, Task, UserStats } from '@/types';

interface DataContextType {
  plans: DailyPlan[];
  journalEntries: JournalEntry[];
  stats: UserStats;
  addPlan: (plan: Omit<DailyPlan, 'id'>) => void;
  updatePlan: (plan: DailyPlan) => void;
  deletePlan: (id: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;
  getTasksForDate: (date: string) => Task[];
  getJournalForDate: (date: string) => JournalEntry | undefined;
  getPlanForDate: (date: string) => DailyPlan | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState<DailyPlan[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalDaysTracked: 0,
    totalTimeSpent: 0,
    tasksCompleted: 0,
    topTechnologies: {},
    streakDays: 0,
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedPlans = localStorage.getItem('codingJourney-plans');
    const storedJournalEntries = localStorage.getItem('codingJourney-journalEntries');
    const storedStats = localStorage.getItem('codingJourney-stats');

    if (storedPlans) setPlans(JSON.parse(storedPlans));
    if (storedJournalEntries) setJournalEntries(JSON.parse(storedJournalEntries));
    if (storedStats) setStats(JSON.parse(storedStats));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('codingJourney-plans', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('codingJourney-journalEntries', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('codingJourney-stats', JSON.stringify(stats));
  }, [stats]);

  // Calculate stats when plans or journal entries change
  useEffect(() => {
    const allTechnologies: Record<string, number> = {};
    let totalTimeSpent = 0;
    let tasksCompleted = 0;

    // Count completed tasks
    plans.forEach(plan => {
      plan.tasks.forEach(task => {
        if (task.completed) {
          tasksCompleted++;
        }
      });
    });

    // Calculate time spent and technologies used
    journalEntries.forEach(entry => {
      totalTimeSpent += entry.timeSpent;

      entry.technologiesUsed.forEach(tech => {
        allTechnologies[tech] = (allTechnologies[tech] || 0) + 1;
      });
    });

    // Sort technologies by frequency
    const sortedTechnologies = Object.fromEntries(
      Object.entries(allTechnologies).sort(([, a], [, b]) => b - a)
    );

    // Calculate streak
    let streak = 0;
    const uniqueDates = new Set([
      ...plans.map(plan => plan.date.split('T')[0]),
      ...journalEntries.map(entry => entry.date.split('T')[0])
    ]);
    const sortedDates = Array.from(uniqueDates).sort((a, b) =>
      new Date(b).getTime() - new Date(a).getTime()
    );

    if (sortedDates.length > 0) {
      streak = 1;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const latestDate = new Date(sortedDates[0]);
      latestDate.setHours(0, 0, 0, 0);

      // Check if latest date is today or yesterday
      const diffTime = today.getTime() - latestDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        streak = 0;
      } else {
        // Check consecutive days
        for (let i = 0; i < sortedDates.length - 1; i++) {
          const currentDate = new Date(sortedDates[i]);
          const nextDate = new Date(sortedDates[i + 1]);

          const dayDiff = Math.round((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));

          if (dayDiff === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    setStats({
      totalDaysTracked: uniqueDates.size,
      totalTimeSpent,
      tasksCompleted,
      topTechnologies: sortedTechnologies,
      streakDays: streak
    });
  }, [plans, journalEntries]);

  const addPlan = (plan: Omit<DailyPlan, 'id'>) => {
    const newPlan: DailyPlan = {
      ...plan,
      id: crypto.randomUUID ? crypto.randomUUID() : `plan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    setPlans(prev => [...prev, newPlan]);
  };

  const updatePlan = (plan: DailyPlan) => {
    setPlans(prev => prev.map(p => p.id === plan.id ? plan : p));
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: crypto.randomUUID ? crypto.randomUUID() : `journal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    setJournalEntries(prev => [...prev, newEntry]);
  };

  const updateJournalEntry = (entry: JournalEntry) => {
    setJournalEntries(prev => prev.map(e => e.id === entry.id ? entry : e));
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries(prev => prev.filter(e => e.id !== id));
  };

  const getTasksForDate = (date: string) => {
    const plan = plans.find(p => p.date.split('T')[0] === date.split('T')[0]);
    return plan ? plan.tasks : [];
  };

  const getJournalForDate = (date: string) => {
    return journalEntries.find(e => e.date.split('T')[0] === date.split('T')[0]);
  };

  const getPlanForDate = (date: string) => {
    return plans.find(p => p.date.split('T')[0] === date.split('T')[0]);
  };

  return (
    <DataContext.Provider
      value={{
        plans,
        journalEntries,
        stats,
        addPlan,
        updatePlan,
        deletePlan,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        getTasksForDate,
        getJournalForDate,
        getPlanForDate,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}
