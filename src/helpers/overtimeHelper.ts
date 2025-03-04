import { TimeEntry } from '../types/EmployeeData';
import { isSunday } from 'date-fns';
import { calculateOvertime, calculateWorkHours } from './workHoursHelper';
import { isRegularHoliday } from './holidayHelper';
import Holidays from '@/types/Holidays';

/**
 * Calculates total regular overtime hours worked (excluding Sundays).
 * @param {TimeEntry[]} timeEntries - Array of time entries for an employee.
 * @returns {number} Total overtime hours worked on regular days.
 */
export const calculateRegularOvertime = (timeEntries: TimeEntry[]): number => {
  return timeEntries.reduce((totalOvertime, entry) => {
    if (!isSunday(new Date(entry.date))) {
      const workedHours = calculateWorkHours(entry.timeIn, entry.timeOut, entry.date);
      return totalOvertime + calculateOvertime(workedHours);
    }
    return totalOvertime;
  }, 0);
};

/**
 * Calculates total overtime hours worked on Sundays.
 * @param {TimeEntry[]} timeEntries - Array of time entries for an employee.
 * @returns {number} Total overtime hours worked on Sundays.
 */
export const calculateTotalSundayOvertime = (timeEntries: TimeEntry[]): number => {
  return timeEntries.reduce((totalOvertime, entry) => {
    if (isSunday(new Date(entry.date))) {
      const workedHours = calculateWorkHours(entry.timeIn, entry.timeOut, entry.date);
      return totalOvertime + calculateOvertime(workedHours);
    }
    return totalOvertime;
  }, 0);
};

/**
 * Calculates the total overtime hours worked on regular holidays.
 *
 * @param {TimeEntry[]} timeEntries - The array of time entries for an employee.
 * @param {Holidays} holidays - The holiday dates categorized by type.
 * @returns {number} The total overtime hours worked on regular holidays.
 */
export const calculateTotalRegularHolidayOvertime = (
  timeEntries: TimeEntry[],
  holidays: Holidays
): number => {
  return timeEntries.reduce((totalOvertime, entry) => {
    if (isRegularHoliday(entry.date, holidays)) {
      const workedHours = calculateWorkHours(entry.timeIn, entry.timeOut, entry.date);
      return totalOvertime + calculateOvertime(workedHours);
    }
    return totalOvertime;
  }, 0);
};
