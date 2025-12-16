import { useState, useEffect } from 'react';
import { CalendarIcon, Plus, Edit, Trash2, ArrowLeft, Clock, Code, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageTitle } from '@/components/ui/PageTitle';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/contexts/DataContext';
import { JournalEntry } from '@/types';
import { getTodayDateString, formatMinutesToTime } from '@/lib/utils';

interface JourneyLogPageProps {
  navigate: (path: string) => void;
}

export default function JourneyLogPage({ navigate }: JourneyLogPageProps) {
  const { toast } = useToast();
  const { journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry, getJournalForDate } = useData();

  const [selectedDate, setSelectedDate] = useState(getTodayDateString());
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('view');

  // Form fields
  const [activities, setActivities] = useState<string[]>(['']);
  const [timeHours, setTimeHours] = useState('');
  const [timeMinutes, setTimeMinutes] = useState('');
  const [technologies, setTechnologies] = useState<string[]>(['']);
  const [challenges, setChallenges] = useState<string[]>(['']);
  const [victories, setVictories] = useState<string[]>(['']);
  const [notes, setNotes] = useState('');

  // Current entry being viewed/edited
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    loadEntry();
  }, [selectedDate]);

  const loadEntry = () => {
    const entry = getJournalForDate(selectedDate);
    setCurrentEntry(entry || null);

    if (entry) {
      // Populate form fields with entry data
      setActivities(entry.activitiesCompleted.length > 0 ? entry.activitiesCompleted : ['']);

      // Calculate hours and minutes
      const hours = Math.floor(entry.timeSpent / 60);
      const minutes = entry.timeSpent % 60;
      setTimeHours(hours.toString());
      setTimeMinutes(minutes.toString());

      setTechnologies(entry.technologiesUsed.length > 0 ? entry.technologiesUsed : ['']);
      setChallenges(entry.challenges.length > 0 ? entry.challenges : ['']);
      setVictories(entry.victories.length > 0 ? entry.victories : ['']);
      setNotes(entry.notes);

      setSelectedTab('view');
      setIsCreating(false);
      setIsEditing(false);
    } else {
      resetForm();
    }
  };

  const resetForm = () => {
    setActivities(['']);
    setTimeHours('');
    setTimeMinutes('');
    setTechnologies(['']);
    setChallenges(['']);
    setVictories(['']);
    setNotes('');
    setIsCreating(false);
    setIsEditing(false);
  };

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date.toISOString().split('T')[0]);
      setIsDatePickerOpen(false);
    }
  };

  const handleSaveEntry = () => {
    // Validate form
    if (activities.filter(a => a.trim()).length === 0) {
      toast({
        title: "Activities Required",
        description: "Please enter at least one activity you completed.",
        variant: "destructive",
      });
      return;
    }

    if (!timeHours && !timeMinutes) {
      toast({
        title: "Time Required",
        description: "Please enter the time you spent coding.",
        variant: "destructive",
      });
      return;
    }

    if (technologies.filter(t => t.trim()).length === 0) {
      toast({
        title: "Technologies Required",
        description: "Please enter at least one technology you used.",
        variant: "destructive",
      });
      return;
    }

    // Calculate total minutes
    const hours = parseInt(timeHours, 10) || 0;
    const minutes = parseInt(timeMinutes, 10) || 0;
    const totalMinutes = (hours * 60) + minutes;

    if (totalMinutes <= 0) {
      toast({
        title: "Invalid Time",
        description: "Please enter a valid time spent coding.",
        variant: "destructive",
      });
      return;
    }

    // Filter empty fields
    const filteredActivities = activities.filter(a => a.trim());
    const filteredTechnologies = technologies.filter(t => t.trim());
    const filteredChallenges = challenges.filter(c => c.trim());
    const filteredVictories = victories.filter(v => v.trim());

    const entryData = {
      date: selectedDate,
      activitiesCompleted: filteredActivities,
      timeSpent: totalMinutes,
      technologiesUsed: filteredTechnologies,
      challenges: filteredChallenges,
      victories: filteredVictories,
      notes: notes.trim(),
    };

    if (currentEntry && isEditing) {
      // Update existing entry
      updateJournalEntry({
        ...entryData,
        id: currentEntry.id,
      });

      toast({
        title: "Journal Updated",
        description: "Your coding journey log has been updated.",
      });
    } else {
      // Create new entry
      addJournalEntry(entryData);

      toast({
        title: "Journal Created",
        description: "Your coding journey log has been saved.",
      });
    }

    loadEntry();
    setSelectedTab('view');
  };

  const handleDeleteEntry = () => {
    if (currentEntry) {
      deleteJournalEntry(currentEntry.id);
      toast({
        title: "Journal Deleted",
        description: "Your coding journey log has been deleted.",
      });
      resetForm();
      setCurrentEntry(null);
    }
  };

  const handleAddItem = (list: string[], setList: (list: string[]) => void) => {
    setList([...list, '']);
  };

  const handleChangeItem = (index: number, value: string, list: string[], setList: (list: string[]) => void) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const handleRemoveItem = (index: number, list: string[], setList: (list: string[]) => void) => {
    if (list.length > 1) {
      const newList = list.filter((_, i) => i !== index);
      setList(newList);
    } else {
      setList(['']);
    }
  };

  // Get sorted entries for the sidebar
  const sortedEntries = [...journalEntries].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const isToday = new Date(selectedDate).toDateString() === new Date().toDateString();

  return (
    <div className="transition-all duration-300 ease-in-out">
      <PageTitle
        title="Coding Journey Log"
        description="Document your daily coding achievements and challenges"
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
        <div className="md:col-span-2 transition-all duration-300">
          <Card className="mb-6 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                  {isToday && <span className="ml-2 text-xs bg-primary/10 text-primary py-0.5 px-2 rounded-full">Today</span>}
                </CardTitle>

                {!isCreating && !isEditing && (
                  <div className="flex gap-2">
                    {currentEntry ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIsEditing(true);
                            setSelectedTab('form');
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteEntry}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => {
                          setIsCreating(true);
                          setSelectedTab('form');
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Create Entry
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {(!currentEntry && !isCreating) ? (
                <EmptyState
                  title="No Log Entry"
                  description={`You haven't created a journal entry for ${new Date(selectedDate).toLocaleDateString()}.`}
                  icon={<BookOpen className="h-6 w-6" />}
                  actionLabel="Create Entry"
                  onAction={() => {
                    setIsCreating(true);
                    setSelectedTab('form');
                  }}
                />
              ) : (
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="view" disabled={isCreating}>View</TabsTrigger>
                    <TabsTrigger value="form">{currentEntry ? 'Edit' : 'Create'}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="view">
                    {currentEntry && (
                      <div className="space-y-6 pt-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2 flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            Time Spent
                          </h3>
                          <p className="text-xl font-bold">
                            {formatMinutesToTime(currentEntry.timeSpent)}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2 flex items-center">
                            <Code className="h-4 w-4 mr-1 text-muted-foreground" />
                            Technologies Used
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {currentEntry.technologiesUsed.map((tech, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">Activities Completed</h3>
                          <ul className="list-disc list-inside space-y-1">
                            {currentEntry.activitiesCompleted.map((activity, index) => (
                              <li key={index}>{activity}</li>
                            ))}
                          </ul>
                        </div>

                        {currentEntry.victories.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium mb-2 flex items-center">
                              <Star className="h-4 w-4 mr-1 text-yellow-500" />
                              Victories &amp; Accomplishments
                            </h3>
                            <ul className="list-disc list-inside space-y-1">
                              {currentEntry.victories.map((victory, index) => (
                                <li key={index}>{victory}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {currentEntry.challenges.length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium mb-2">Challenges Faced</h3>
                            <ul className="list-disc list-inside space-y-1">
                              {currentEntry.challenges.map((challenge, index) => (
                                <li key={index}>{challenge}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {currentEntry.notes && (
                          <div>
                            <h3 className="text-sm font-medium mb-2">Notes &amp; Reflections</h3>
                            <p className="whitespace-pre-line">{currentEntry.notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="form">
                    <div className="space-y-4 pt-4">
                      {/* Time Spent */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Time Spent Coding *</label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Hours"
                              min="0"
                              value={timeHours}
                              onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                if (isNaN(value) || value < 0) {
                                  setTimeHours('');
                                } else {
                                  setTimeHours(e.target.value);
                                }
                              }}
                            />
                          </div>
                          <div className="text-sm font-medium">hours</div>
                          <div className="flex-1">
                            <Input
                              type="number"
                              placeholder="Minutes"
                              min="0"
                              max="59"
                              value={timeMinutes}
                              onChange={(e) => {
                                const value = parseInt(e.target.value, 10);
                                if (isNaN(value) || value < 0) {
                                  setTimeMinutes('');
                                } else if (value > 59) {
                                  setTimeMinutes('59');
                                } else {
                                  setTimeMinutes(e.target.value);
                                }
                              }}
                            />
                          </div>
                          <div className="text-sm font-medium">minutes</div>
                        </div>
                      </div>

                      {/* Activities */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Activities Completed *</label>
                        <div className="space-y-2">
                          {activities.map((activity, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                placeholder="What did you work on?"
                                value={activity}
                                onChange={(e) => handleChangeItem(index, e.target.value, activities, setActivities)}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(index, activities, setActivities)}
                                disabled={activities.length === 1 && !activity}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddItem(activities, setActivities)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Activity
                          </Button>
                        </div>
                      </div>

                      {/* Technologies */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Technologies Used *</label>
                        <div className="space-y-2">
                          {technologies.map((tech, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                placeholder="e.g., React, Python, Docker"
                                value={tech}
                                onChange={(e) => handleChangeItem(index, e.target.value, technologies, setTechnologies)}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(index, technologies, setTechnologies)}
                                disabled={technologies.length === 1 && !tech}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddItem(technologies, setTechnologies)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Technology
                          </Button>
                        </div>
                      </div>

                      {/* Victories */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Victories &amp; Accomplishments</label>
                        <div className="space-y-2">
                          {victories.map((victory, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                placeholder="What went well?"
                                value={victory}
                                onChange={(e) => handleChangeItem(index, e.target.value, victories, setVictories)}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(index, victories, setVictories)}
                                disabled={victories.length === 1 && !victory}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddItem(victories, setVictories)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Victory
                          </Button>
                        </div>
                      </div>

                      {/* Challenges */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Challenges Faced</label>
                        <div className="space-y-2">
                          {challenges.map((challenge, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                placeholder="What challenges did you overcome?"
                                value={challenge}
                                onChange={(e) => handleChangeItem(index, e.target.value, challenges, setChallenges)}
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(index, challenges, setChallenges)}
                                disabled={challenges.length === 1 && !challenge}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddItem(challenges, setChallenges)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Challenge
                          </Button>
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="text-sm font-medium mb-2 block">Notes &amp; Reflections</label>
                        <Textarea
                          placeholder="Any additional thoughts, learnings, or reflections about your day..."
                          rows={4}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            loadEntry();
                            setSelectedTab('view');
                            setIsCreating(false);
                            setIsEditing(false);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSaveEntry}>
                          {currentEntry ? 'Update Entry' : 'Save Entry'}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Recent Entries */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Entries</CardTitle>
              <CardDescription>Your coding journey history</CardDescription>
            </CardHeader>
            <CardContent>
              {sortedEntries.length > 0 ? (
                <div className="space-y-3">
                  {sortedEntries.map((entry) => (
                    <Button
                      key={entry.id}
                      variant="outline"
                      className={`w-full justify-start h-auto py-3 ${
                        entry.date === selectedDate ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedDate(entry.date)}
                    >
                      <div className="flex flex-col items-start">
                        <div className="font-medium">
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatMinutesToTime(entry.timeSpent)}
                          <span className="mx-1">•</span>
                          <span>{entry.technologiesUsed.slice(0, 2).join(', ')}</span>
                          {entry.technologiesUsed.length > 2 && <span> +{entry.technologiesUsed.length - 2}</span>}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No journal entries yet.</p>
                  <p className="text-sm mt-1">
                    Start logging your coding journey!
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setSelectedDate(getTodayDateString());
                  setIsCreating(true);
                  setSelectedTab('form');
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create New Entry
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
