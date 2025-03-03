import { TimeEntry } from '../types/EmployeeData';
import Holidays from '@/types/Holidays';

export const calculateRegularHoliday = (timeEntries: TimeEntry[], holidays: Holidays): number => {
  if (!timeEntries?.length || !holidays?.regular?.dates) {
    return 0; // Handle cases where inputs are missing or empty
  }

  return timeEntries.reduce((total, entry) => {
    const isRegularHoliday = holidays.regular.dates.has(entry.date);
    return total + (isRegularHoliday ? 2 : 1);
  }, 0);
};

export const isRegularHoliday = (date: string, holidays: Holidays): boolean => {
  return holidays.regular.dates.has(date);
};
