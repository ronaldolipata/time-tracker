import { TimeEntry } from '../types/EmployeeData';
import { isSunday } from 'date-fns';
import { isValidTimeEntry } from '@/utils/isValidTimeEntry';
import { isRegularHoliday } from './holidayHelper';
import Holidays from '@/types/Holidays';

/**
 * Calculates the total number of regular workdays (excluding Sundays).
 * @param {TimeEntry[]} timeEntries - Array of time entries for an employee.
 * @returns {number} Total count of regular workdays.
 */
export const calculateTotalRegularWorkDays = (
  timeEntries: TimeEntry[],
  holidays: Holidays
): number => {
  return timeEntries.filter((entry) => {
    return (
      !isSunday(new Date(entry.date)) &&
      isValidTimeEntry(entry.timeIn, entry.timeOut) &&
      !isRegularHoliday(entry.date, holidays)
    );
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
