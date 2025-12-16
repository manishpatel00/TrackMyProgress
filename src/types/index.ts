export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  timeEstimate?: number; // in minutes
}

export interface DailyPlan {
  id: string;
  date: string; // ISO format
  tasks: Task[];
  notes?: string;
}

export interface JournalEntry {
  id: string;
  date: string; // ISO format
  activitiesCompleted: string[];
  timeSpent: number; // in minutes
  technologiesUsed: string[];
  challenges: string[];
  victories: string[];
  notes: string;
}

export interface UserStats {
  totalDaysTracked: number;
  totalTimeSpent: number; // in minutes
  tasksCompleted: number;
  topTechnologies: Record<string, number>; // technology name -> frequency
  streakDays: number;
}
