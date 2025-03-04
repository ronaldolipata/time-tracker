import { differenceInMinutes, parse } from 'date-fns';

const MINUTES_IN_HOUR = 60;
const LUNCH_BREAK_MINUTES = 60; // 1-hour lunch break
const REGULAR_WORK_HOURS = 8;
const MINIMUM_HALF_DAY_HOURS = 4;

/**
 * Calculates the total work hours excluding lunch break.
 * @param {string} timeIn - Employee's clock-in time (e.g., "8:00 AM").
 * @param {string} timeOut - Employee's clock-out time (e.g., "5:00 PM").
 * @param {string} dateStr - Date string in YYYY-MM-DD format.
 * @returns {number} Total work hours, rounded to the nearest hour.
 */
export const calculateWorkHours = (timeIn: string, timeOut: string, dateStr: string): number => {
  if (!timeIn || !timeOut || timeIn.trim() === '-' || timeOut.trim() === '-') {
    return 0;
  }

  try {
    const parseTime = (timeStr: string, referenceDate: string): Date => {
      const parsedDate = parse(timeStr, 'h:mm a', new Date(referenceDate));
      if (isNaN(parsedDate.getTime())) {
        throw new Error(`Invalid time format: ${timeStr}`);
      }
      return parsedDate;
    };

    const inTime = parseTime(timeIn, dateStr);
    const outTime = parseTime(timeOut, dateStr);

    if (outTime <= inTime) {
      throw new Error('Clock-out time must be later than clock-in time.');
    }

    const totalMinutesWorked = differenceInMinutes(outTime, inTime);

    // Only deduct lunch break if the shift includes lunchtime (e.g., 12:00 PM)
    const lunchStart = parse('12:00 PM', 'h:mm a', new Date(dateStr));
    const lunchEnd = parse('1:00 PM', 'h:mm a', new Date(dateStr));

    let netMinutesWorked = totalMinutesWorked;

    if (inTime < lunchEnd && outTime > lunchStart) {
      // The employee's shift includes or overlaps lunchtime
      netMinutesWorked -= LUNCH_BREAK_MINUTES;
    }

    return Math.max(0, netMinutesWorked / MINUTES_IN_HOUR);
  } catch (error) {
    console.error(
      `Error calculating work hours: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    return 0;
  }
};

/**
 * Determines if a work entry meets the minimum required hours.
 * @param {string} timeIn - Clock-in time.
 * @param {string} timeOut - Clock-out time.
 * @param {string} dateStr - Date string in YYYY-MM-DD format.
 * @returns {number} 1 for full day, 0.5 for half day, 0 otherwise.
 */
export const calculateWorkedDuration = (
  timeIn: string,
  timeOut: string,
  dateStr: string
): number => {
  const workedDuration = calculateWorkHours(timeIn, timeOut, dateStr);

  if (workedDuration >= REGULAR_WORK_HOURS) return 1;
  if (workedDuration >= MINIMUM_HALF_DAY_HOURS) return 0.5;

  return 0;
};

/**
 * Checks if the employee has worked a full regular workday.
 * @param {string} dateStr - The date of the work entry in YYYY-MM-DD format.
 * @param {string} timeIn - The employee's clock-in time (e.g., "8:00 AM").
 * @param {string} timeOut - The employee's clock-out time (e.g., "5:00 PM").
 * @returns {boolean} `true` if the employee worked at least the required regular work hours, otherwise `false`.
 */
export const isWorkedWholeDay = (dateStr: string, timeIn: string, timeOut: string): boolean => {
  const workedDuration = calculateWorkHours(timeIn, timeOut, dateStr);
  return workedDuration >= REGULAR_WORK_HOURS;
};

/**
 * Checks if the employee has worked at least a half-day.
 * @param {string} dateStr - The date of the work entry in YYYY-MM-DD format.
 * @param {string} timeIn - The employee's clock-in time (e.g., "8:00 AM").
 * @param {string} timeOut - The employee's clock-out time (e.g., "12:00 PM").
 * @returns {boolean} `true` if the employee worked at least the minimum required hours for a half-day, otherwise `false`.
 */
export const isWorkedHalfDay = (dateStr: string, timeIn: string, timeOut: string): boolean => {
  const workedDuration = calculateWorkHours(timeIn, timeOut, dateStr);
  return workedDuration >= MINIMUM_HALF_DAY_HOURS;
};

/**
 * Calculates overtime hours worked beyond the regular working hours.
 * @param {number} workedHours - Total hours worked in a day.
 * @returns {number} Overtime hours (if any).
 */
export const calculateOvertime = (workedHours: number): number => {
  const REGULAR_HOURS = 8;

  if (workedHours < 0 || isNaN(workedHours)) {
    throw new Error('Invalid input: workedHours must be a non-negative number.');
  }

  return Math.max(0, workedHours - REGULAR_HOURS);
};
