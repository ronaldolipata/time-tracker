import { TimeEntry } from '../types/EmployeeData';
import { isSunday } from 'date-fns';
import { isValidTimeEntry } from '@/utils/isValidTimeEntry';

/**
 * Calculates the total number of regular workdays (excluding Sundays).
 * @param {TimeEntry[]} timeEntries - Array of time entries for an employee.
 * @returns {number} Total count of regular workdays.
 */
export const calculateTotalRegularWorkDays = (timeEntries: TimeEntry[]): number => {
  return timeEntries.filter((entry) => {
    return !isSunday(new Date(entry.date)) && isValidTimeEntry(entry.timeIn, entry.timeOut);
  }).length;
};

/**
 * Calculates the total number of Sundays worked.
 * @param {TimeEntry[]} timeEntries - Array of time entries for an employee.
 * @returns {number} Total count of Sundays worked.
 */
export const calculateTotalSundayWorkDays = (timeEntries: TimeEntry[]): number => {
  return timeEntries.filter((entry) => {
    return isSunday(new Date(entry.date)) && isValidTimeEntry(entry.timeIn, entry.timeOut);
  }).length;
};
