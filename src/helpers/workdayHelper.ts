import { TimeEntry } from '../types/EmployeeData';
import { isSunday } from 'date-fns';
import { isValidTimeEntry } from '@/utils/isValidTimeEntry';
import { isRegularHoliday } from './holidayHelper';
import Holidays from '@/types/Holidays';
import { isWorkedHalfDay, isWorkedWholeDay } from './workHoursHelper';

/**
 * Checks if the given date is a valid regular workday.
 * @param {string} date - The date of the work entry.
 * @param {string} timeIn - The time-in entry.
 * @param {string} timeOut - The time-out entry.
 * @param {Holidays} holidays - List of holidays.
 * @returns {boolean} Whether the date is a valid workday.
 */
export const isValidRegularWorkDay = (
  date: string,
  timeIn: string,
  timeOut: string,
  holidays: Holidays
): boolean => {
  const parsedDate = new Date(date);

  // Exclude Sundays immediately
  if (isSunday(parsedDate)) return false;

  // Exclude holidays
  if (isRegularHoliday(date, holidays)) return false;

  // Exclude if no valid time entry
  if (!isValidTimeEntry(timeIn, timeOut)) return false;

  return true;
};

/**
 * Calculates the total number of regular workdays (excluding Sundays and holidays).
 * @param {TimeEntry[]} timeEntries - Array of time entries for an employee.
 * @param {Holidays} holidays - List of holidays.
 * @returns {number} Total count of regular workdays.
 */
export const calculateTotalRegularWorkDays = (
  timeEntries: TimeEntry[],
  holidays: Holidays
): number => {
  return timeEntries.reduce((total, { date, timeIn, timeOut }) => {
    if (!isValidRegularWorkDay(date, timeIn, timeOut, holidays)) return total;

    if (isWorkedWholeDay(date, timeIn, timeOut)) {
      return total + 1;
    }

    if (isWorkedHalfDay(date, timeIn, timeOut)) {
      return total + 0.5;
    }

    return total;
  }, 0);
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
