import { differenceInMinutes, parse, addDays } from 'date-fns';
import { WorkTime } from '@/enums/WorkTime';
import { BreakTime } from '@/enums/BreakTime';

/**
 * Calculates the total work hours excluding lunch break when applicable.
 * @param {string} timeIn - Employee's clock-in time (e.g., "8:00 AM", "5:00 PM").
 * @param {string} timeOut - Employee's clock-out time (e.g., "5:00 PM", "5:00 AM").
 * @param {string} dateStr - Date string in YYYY-MM-DD format.
 * @returns {number} Total work hours, rounded to the nearest hour.
 */
export function calculateWorkHours(timeIn: string, timeOut: string, dateStr: string): number {
  if (!timeIn || !timeOut || timeIn.trim() === '-' || timeOut.trim() === '-') return 0;

  try {
    const parseTime = (timeStr: string, referenceDate: string, inTime?: Date): Date => {
      // Normalize midnight and noon representations
      const normalizedTimeStr = (() => {
        const upperTimeStr = timeStr.trim().toUpperCase();
        switch (upperTimeStr) {
          case '12:00 AM':
          case '12:00 MN':
            return '12:00 AM';
          case '12:00 PM':
          case '12:00 NN':
            return '12:00 PM';
          default:
            return timeStr;
        }
      })();

      // Parse the time
      const parsedDate = parse(normalizedTimeStr, 'h:mm a', new Date(referenceDate));

      // If in time is provided and parsed time is earlier or equal, move to next day
      if (inTime && parsedDate <= inTime) return addDays(parsedDate, 1);

      if (isNaN(parsedDate.getTime())) {
        throw new Error(`Invalid time format: ${timeStr}`);
      }
      return parsedDate;
    };

    // First parse the in time
    const inTime = parseTime(timeIn, dateStr);

    // Then parse out time, passing in time as a reference
    const outTime = parseTime(timeOut, dateStr, inTime);

    // Special case: if times are exactly the same, consider it a 24-hour shift
    if (outTime.getTime() === inTime.getTime()) return 24;

    if (outTime <= inTime) {
      throw new Error('Clock-out time must be later than clock-in time.');
    }

    const totalMinutesWorked = differenceInMinutes(outTime, inTime);
    let netMinutesWorked = totalMinutesWorked;

    // Only subtract lunch break if the total work time is at least a full day (8 hours)
    const totalHoursWorked = totalMinutesWorked / WorkTime.MINUTES_IN_HOUR;
    if (totalHoursWorked >= WorkTime.REGULAR_WORK_HOURS) {
      netMinutesWorked -= BreakTime.LUNCH_BREAK_MINUTES;
    }

    const workedHours = Math.max(0, netMinutesWorked / WorkTime.MINUTES_IN_HOUR);

    return Number(workedHours.toFixed(2));
  } catch (error) {
    console.error(
      `Error calculating work hours: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    return 0;
  }
}

/**
 * Checks if the employee has worked a full regular workday.
 * @param {string} dateStr - The date of the work entry in YYYY-MM-DD format.
 * @param {string} timeIn - The employee's clock-in time (e.g., "8:00 AM").
 * @param {string} timeOut - The employee's clock-out time (e.g., "5:00 PM", "5:00 AM").
 * @returns {boolean} `true` if the employee worked at least the required regular work hours, otherwise `false`.
 */
export function isWorkedWholeDay(dateStr: string, timeIn: string, timeOut: string): boolean {
  const workedDuration = calculateWorkHours(timeIn, timeOut, dateStr);
  return workedDuration >= WorkTime.REGULAR_WORK_HOURS;
}

/**
 * Checks if the employee has worked at least a half-day.
 * @param {string} dateStr - The date of the work entry in YYYY-MM-DD format.
 * @param {string} timeIn - The employee's clock-in time (e.g., "8:00 AM").
 * @param {string} timeOut - The employee's clock-out time (e.g., "12:00 PM", "5:00 AM").
 * @returns {boolean} `true` if the employee worked at least the minimum required hours for a half-day, otherwise `false`.
 */
export function isWorkedHalfDay(dateStr: string, timeIn: string, timeOut: string): boolean {
  const workedDuration = calculateWorkHours(timeIn, timeOut, dateStr);
  return workedDuration >= WorkTime.MINIMUM_HALF_DAY_HOURS;
}
