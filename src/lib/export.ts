import { DailyPlan, JournalEntry, UserStats } from '@/types';

interface ExportData {
  plans: DailyPlan[];
  journalEntries: JournalEntry[];
  stats: UserStats;
  exportDate: string;
  version: string;
}

/**
 * Export all user data as a JSON file
 */
export function exportUserData(plans: DailyPlan[], journalEntries: JournalEntry[], stats: UserStats) {
  const exportData: ExportData = {
    plans,
    journalEntries,
    stats,
    exportDate: new Date().toISOString(),
    version: '1.0.0',
  };

  // Convert to JSON
  const jsonData = JSON.stringify(exportData, null, 2);

  // Create a blob and download link
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Create a temporary anchor element and trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = `coding-journey-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();

  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Import data from a JSON file
 */
export function importUserData(jsonData: string): ExportData | null {
  try {
    const data = JSON.parse(jsonData) as ExportData;

    // Basic validation
    if (!data.plans || !data.journalEntries || !data.stats) {
      throw new Error('Invalid data format');
    }

    return data;
  } catch (error) {
    console.error('Error importing data:', error);
    return null;
  }
}

/**
 * Read a file as text
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('File reading error'));
    reader.readAsText(file);
  });
}
