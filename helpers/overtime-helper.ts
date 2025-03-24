import { TimeEntry, Holidays } from '@/context/types';
import { isSunday } from 'date-fns';
import { calculateWorkHours } from './work-hours-helper';
import { isRegularHoliday } from './holiday-helper';
import { WorkTime } from '@/enums/work-time';

/**
 * Calculates overtime hours worked beyond the regular working hours.
 * @param {number} workedHours - Total hours worked in a day.
 * @returns {number} Overtime hours (if any).
 */
export function calculateOvertime(workedHours: number): number {
  if (workedHours < 0 || isNaN(workedHours)) {
    throw new Error('Invalid input: workedHours must be a non-negative number.');
  }

  return Math.max(0, workedHours - WorkTime.REGULAR_WORK_HOURS);
}

/**
 * Calculates total regular overtime hours worked (excluding Sundays).
 * @param {TimeEntry[]} timeEntries - Array of time entries for an employee.
 * @returns {number} Total overtime hours worked on regular days.
 */
export function calculateRegularOvertime(timeEntries: TimeEntry[]): number {
  return timeEntries.reduce((totalOvertime, entry) => {
    if (!isSunday(new Date(entry.date))) {
      const workedHours = calculateWorkHours(entry.timeIn, entry.timeOut, entry.date);
      return totalOvertime + calculateOvertime(workedHours);
    }
    return totalOvertime;
  }, 0);
}

/**
 * Calculates total overtime hours worked on Sundays.
 * @param {TimeEntry[]} timeEntries - Array of time entries for an employee.
 * @returns {number} Total overtime hours worked on Sundays.
 */
export function calculateTotalSundayOvertime(timeEntries: TimeEntry[]): number {
  return timeEntries.reduce((totalOvertime, entry) => {
    if (isSunday(new Date(entry.date))) {
      const workedHours = calculateWorkHours(entry.timeIn, entry.timeOut, entry.date);
      return totalOvertime + calculateOvertime(workedHours);
    }
    return totalOvertime;
  }, 0);
}

/**
 * Calculates the total overtime hours worked on regular holidays.
 *
 * @param {TimeEntry[]} timeEntries - The array of time entries for an employee.
 * @param {Holidays} holidays - The holiday dates categorized by type.
 * @returns {number} The total overtime hours worked on regular holidays.
 */
export function calculateTotalRegularHolidayOvertime(
  timeEntries: TimeEntry[],
  holidays: Holidays
): number {
  return timeEntries.reduce((totalOvertime, entry) => {
    if (isRegularHoliday(entry.date, holidays)) {
      const workedHours = calculateWorkHours(entry.timeIn, entry.timeOut, entry.date);
      return totalOvertime + calculateOvertime(workedHours);
    }
    return totalOvertime;
  }, 0);
}
