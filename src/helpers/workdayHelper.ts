import { TimeEntry } from '../types/EmployeeData';
import { isSunday } from 'date-fns';
import { isValidTimeEntry } from '@/utils/isValidTimeEntry';
import {
  isRegularHoliday,
  isSpecialNonWorkingHoliday,
  isSpecialWorkingHoliday,
} from './holidayHelper';
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

  // Exclude Sundays
  if (isSunday(parsedDate)) return false;

  // Exclude Holidays
  if (isRegularHoliday(date, holidays)) return false;
  if (isSpecialNonWorkingHoliday(date, holidays)) return false;
  if (isSpecialWorkingHoliday(date, holidays)) return false;

  // Exclude if no valid time entry
  if (!isValidTimeEntry(timeIn, timeOut)) return false;

  return true;
};

/**
 * Calculates the total number of regular worked (excluding Sundays and holidays).
 * @param {TimeEntry[]} timeEntries - Array of time entries for an employee.
 * @param {Holidays} holidays - List of holidays.
 * @returns {number} Total count of regular worked.
 */
export const calculateTotalRegularWorkDays = (
  timeEntries: TimeEntry[],
  holidays: Holidays
): number => {
  return timeEntries.reduce((total, { date, timeIn, timeOut }) => {
    if (!isValidRegularWorkDay(date, timeIn, timeOut, holidays)) return total;
    if (isWorkedWholeDay(date, timeIn, timeOut)) return total + 1;
    if (isWorkedHalfDay(date, timeIn, timeOut)) return total + 0.5;
    return total;
  }, 0);
};

/**
 * Checks if the given date is a valid sunday workday.
 * @param {string} date - The date of the work entry.
 * @param {string} timeIn - The time-in entry.
 * @param {string} timeOut - The time-out entry.
 * @param {Holidays} holidays - List of holidays.
 * @returns {boolean} Whether the date is a valid workday.
 */
export const isValidSundayWorkDay = (
  date: string,
  timeIn: string,
  timeOut: string,
  holidays: Holidays
): boolean => {
  const parsedDate = new Date(date);

  // Exclude if not Sunday
  if (!isSunday(parsedDate)) return false;

  // Exclude Holidays
  if (isRegularHoliday(date, holidays)) return false;
  if (isSpecialNonWorkingHoliday(date, holidays)) return false;
  if (isSpecialWorkingHoliday(date, holidays)) return false;

  // Exclude if no valid time entry
  if (!isValidTimeEntry(timeIn, timeOut)) return false;

  return true;
};

/**
 * Calculates the total number of Sundays worked.
 * @param {TimeEntry[]} timeEntries - Array of time entries for an employee.
 * @returns {number} Total count of Sundays worked.
 */
export const calculateTotalSundayWorkDays = (
  timeEntries: TimeEntry[],
  holidays: Holidays
): number => {
  return timeEntries.reduce((total, { date, timeIn, timeOut }) => {
    if (!isValidSundayWorkDay(date, timeIn, timeOut, holidays)) return total;
    if (isWorkedWholeDay(date, timeIn, timeOut)) return total + 1;
    if (isWorkedHalfDay(date, timeIn, timeOut)) return total + 0.5;
    return total;
  }, 0);
};

// @TODO: Handle Sunday that is also a Regular Holiday
// @TODO: Handle Sunday that is also a Special Non-working Holiday
