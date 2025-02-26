import { differenceInMinutes, parse } from 'date-fns';

const MINUTES_IN_HOUR = 60;
const LUNCH_BREAK_MINUTES = 60; // 1-hour lunch break

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
    const netMinutesWorked = totalMinutesWorked - LUNCH_BREAK_MINUTES;

    return Math.max(0, netMinutesWorked / MINUTES_IN_HOUR);
  } catch (error) {
    console.error(`Error calculating work hours: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return 0;
  }
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
