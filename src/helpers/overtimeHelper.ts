import { TimeEntry } from '../types/EmployeeData';
import { isSunday } from 'date-fns';
import { calculateOvertime, calculateWorkHours } from './workHoursHelper';

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
