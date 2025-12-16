import { useState, useEffect } from 'react';
import { Plus, Trash2, CalendarIcon, Check, Clock, ArrowLeft, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTitle } from '@/components/ui/PageTitle';
import { useData } from '@/contexts/DataContext';
import { Task, DailyPlan } from '@/types';
import { getPriorityColor, getTodayDateString, formatMinutesToTime } from '@/lib/utils';

interface DailyPlanPageProps {
  navigate: (path: string) => void;
}

export default function DailyPlanPage({ navigate }: DailyPlanPageProps) {
  const { toast } = useToast();
  const { plans, addPlan, updatePlan, deletePlan, getPlanForDate } = useData();

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [currentPlan, setCurrentPlan] = useState<DailyPlan | null>(null);
  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskTimeEstimate, setNewTaskTimeEstimate] = useState('');
  const [newPlanNotes, setNewPlanNotes] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  // Load plan for selected date
  useEffect(() => {
    const plan = getPlanForDate(selectedDate);
    if (plan) {
      setCurrentPlan(plan);
      setNewPlanNotes(plan.notes || '');
    } else {
      setCurrentPlan(null);
      setNewPlanNotes('');
    }
    setIsAddingTask(false);
    setEditingTaskId(null);
  }, [selectedDate, getPlanForDate]);

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date.toISOString().split('T')[0]);
      setIsDatePickerOpen(false);
    }
  };

  const handleAddTask = () => {
    if (!newTask.trim()) {
      toast({
        title: "Task Required",
        description: "Please enter a task title.",
        variant: "destructive",
      });
      return;
    }

    const task: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: newTask.trim(),
      description: newTaskDescription.trim() || undefined,
      priority: newTaskPriority,
      completed: false,
      timeEstimate: newTaskTimeEstimate ? parseInt(newTaskTimeEstimate, 10) : undefined,
    };

    if (currentPlan) {
      // Update existing plan
      const updatedPlan = {
        ...currentPlan,
        tasks: [...currentPlan.tasks, task],
      };
      updatePlan(updatedPlan);
      setCurrentPlan(updatedPlan);
    } else {
      // Create new plan
      const newPlan: Omit<DailyPlan, 'id'> = {
        date: selectedDate,
        tasks: [task],
        notes: newPlanNotes.trim() || undefined,
      };
      addPlan(newPlan);
      const plan = getPlanForDate(selectedDate);
      setCurrentPlan(plan || null);
    }

    // Reset form
    setNewTask('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setNewTaskTimeEstimate('');
    setIsAddingTask(false);

    toast({
      title: "Task Added",
      description: `"${task.title}" has been added to your plan.`,
    });
  };

  const handleUpdateTask = (task: Task) => {
    if (currentPlan) {
      const updatedTasks = currentPlan.tasks.map(t =>
        t.id === task.id ? task : t
      );

      const updatedPlan = {
        ...currentPlan,
        tasks: updatedTasks,
      };

      updatePlan(updatedPlan);
      setCurrentPlan(updatedPlan);
      setEditingTaskId(null);
    }
  };

  const handleToggleTask = (taskId: string, completed: boolean) => {
    if (currentPlan) {
      const updatedTasks = currentPlan.tasks.map(task =>
        task.id === taskId ? { ...task, completed } : task
      );

      const updatedPlan = {
        ...currentPlan,
        tasks: updatedTasks,
      };

      updatePlan(updatedPlan);
      setCurrentPlan(updatedPlan);

      toast({
        title: completed ? "Task Completed" : "Task Reopened",
        description: `Task marked as ${completed ? 'completed' : 'incomplete'}.`,
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    if (currentPlan) {
      const taskToDelete = currentPlan.tasks.find(t => t.id === taskId);
      const updatedTasks = currentPlan.tasks.filter(task => task.id !== taskId);

      if (updatedTasks.length === 0) {
        // Delete the entire plan if no tasks remain
        deletePlan(currentPlan.id);
        setCurrentPlan(null);
      } else {
        // Update plan with remaining tasks
        const updatedPlan = {
          ...currentPlan,
          tasks: updatedTasks,
        };
        updatePlan(updatedPlan);
        setCurrentPlan(updatedPlan);
      }

      toast({
        title: "Task Deleted",
        description: taskToDelete ? `"${taskToDelete.title}" has been removed.` : "Task has been removed.",
      });
    }
  };

  const handleUpdateNotes = () => {
    if (currentPlan) {
      const updatedPlan = {
        ...currentPlan,
        notes: newPlanNotes.trim() || undefined,
      };
      updatePlan(updatedPlan);

      toast({
        title: "Notes Updated",
        description: "Your plan notes have been saved.",
      });
    } else if (newPlanNotes.trim()) {
      // Create a new plan with just notes
      const newPlan: Omit<DailyPlan, 'id'> = {
        date: selectedDate,
        tasks: [],
        notes: newPlanNotes.trim(),
      };
      addPlan(newPlan);
      const plan = getPlanForDate(selectedDate);
      setCurrentPlan(plan || null);

      toast({
        title: "Notes Added",
        description: "Your plan notes have been saved.",
      });
    }
  };

  const handleCancelAddTask = () => {
    setIsAddingTask(false);
    setNewTask('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    setNewTaskTimeEstimate('');
  };

  // Calculate completion metrics
  const completedTasks = currentPlan?.tasks.filter(task => task.completed).length || 0;
  const totalTasks = currentPlan?.tasks.length || 0;
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="transition-all duration-300 ease-in-out">
      <PageTitle
        title="Daily Coding Plan"
        description="Plan and track your daily coding tasks"
      >
        <div className="flex items-center gap-2 transition-all duration-300">
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-9 gap-1.5">
                <CalendarIcon className="h-4 w-4" />
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={new Date(selectedDate)}
                onSelect={handleSelectDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </PageTitle>

      <div className="grid gap-6 md:grid-cols-3 transition-all duration-300">
        <div className="space-y-6 md:col-span-2 transition-all duration-300">
          {/* Task List */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Tasks</CardTitle>
              {currentPlan && !isAddingTask && (
                <Button size="sm" onClick={() => setIsAddingTask(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {!currentPlan && !isAddingTask ? (
                <EmptyState
                  title="No Tasks Planned"
                  description={`You don't have any tasks planned for ${new Date(selectedDate).toLocaleDateString()}.`}
                  actionLabel="Create a Task"
                  onAction={() => setIsAddingTask(true)}
                />
              ) : isAddingTask ? (
                <div className="space-y-4 py-2">
                  <div>
                    <label htmlFor="task-title" className="text-sm font-medium block mb-1">
                      Task Title *
                    </label>
                    <Input
                      id="task-title"
                      placeholder="What do you plan to work on?"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                    />
                  </div>

                  <div>
                    <label htmlFor="task-description" className="text-sm font-medium block mb-1">
                      Description (Optional)
                    </label>
                    <Textarea
                      id="task-description"
                      placeholder="Add details about this task..."
                      rows={2}
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="task-priority" className="text-sm font-medium block mb-1">
                        Priority
                      </label>
                      <Select
                        value={newTaskPriority}
                        onValueChange={(value) => setNewTaskPriority(value as 'low' | 'medium' | 'high')}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label htmlFor="time-estimate" className="text-sm font-medium block mb-1">
                        Time Estimate (minutes)
                      </label>
                      <Input
                        id="time-estimate"
                        type="number"
                        placeholder="e.g., 60"
                        value={newTaskTimeEstimate}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (isNaN(value) || value < 0) {
                            setNewTaskTimeEstimate('');
                          } else {
                            setNewTaskTimeEstimate(e.target.value);
                          }
                        }}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <Button variant="outline" onClick={handleCancelAddTask}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddTask}>
                      Add Task
                    </Button>
                  </div>
                </div>
              ) : currentPlan && (
                <div className="space-y-4">
                  {currentPlan.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-start p-3 border rounded-lg ${
                        task.completed ? 'bg-muted/50 border-muted' : 'bg-card border-border'
                      }`}
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={(checked) => handleToggleTask(task.id, checked === true)}
                        className="mt-1 mr-3"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleDeleteTask(task.id)}
                            >
                              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                            </Button>
                          </div>
                        </div>

                        {task.description && (
                          <p className={`text-sm mt-1 ${task.completed ? 'text-muted-foreground' : ''}`}>
                            {task.description}
                          </p>
                        )}

                        {task.timeEstimate && (
                          <div className="flex items-center mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            Est: {formatMinutesToTime(task.timeEstimate)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {currentPlan.tasks.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No tasks added yet.</p>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => setIsAddingTask(true)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Your First Task
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              {currentPlan && !isAddingTask && currentPlan.tasks.length > 0 && (
                <>
                  <div className="text-sm text-muted-foreground">
                    {completedTasks} of {totalTasks} tasks completed
                  </div>
                  <Button size="sm" onClick={() => setIsAddingTask(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Task
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6 transition-all duration-300">
          {/* Notes */}
          <Card className="transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add notes about your goals, focus areas, or anything else for today..."
                rows={6}
                value={newPlanNotes}
                onChange={(e) => setNewPlanNotes(e.target.value)}
              />
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button
                onClick={handleUpdateNotes}
                className="w-full"
                disabled={newPlanNotes === (currentPlan?.notes || '')}
              >
                Save Notes
              </Button>
            </CardFooter>
          </Card>

          {/* Daily Status */}
          {currentPlan && currentPlan.tasks.length > 0 && (
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Daily Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Completion</span>
                  <span>{completedTasks}/{totalTasks} ({Math.round(completionPercentage)}%)</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>

                {currentPlan.tasks.some(t => t.timeEstimate) && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Estimated Time</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Remaining</span>
                        <span>
                          {formatMinutesToTime(
                            currentPlan.tasks
                              .filter(t => !t.completed && t.timeEstimate)
                              .reduce((sum, task) => sum + (task.timeEstimate || 0), 0)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completed</span>
                        <span>
                          {formatMinutesToTime(
                            currentPlan.tasks
                              .filter(t => t.completed && t.timeEstimate)
                              .reduce((sum, task) => sum + (task.timeEstimate || 0), 0)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-medium pt-1 border-t">
                        <span>Total</span>
                        <span>
                          {formatMinutesToTime(
                            currentPlan.tasks
                              .filter(t => t.timeEstimate)
                              .reduce((sum, task) => sum + (task.timeEstimate || 0), 0)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
