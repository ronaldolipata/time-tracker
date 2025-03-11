import { isValidTimeEntry } from '@/utils/isValidTimeEntry';
import { TimeEntry } from '../types/EmployeeData';
import Holidays from '@/types/Holidays';
import { addDays, isSunday, subDays } from 'date-fns';

/**
 * Calculates the total count of **regular holidays** that an employee qualifies for.
 * @param {TimeEntry[]} timeEntries - List of employee time entries.
 * @param {Holidays} holidays - Object containing holiday dates.
 * @returns {number} Total count of regular holiday payments.
 */
export function calculateTotalRegularHoliday(timeEntries: TimeEntry[], holidays: Holidays): number {
  if (!Array.isArray(timeEntries) || timeEntries.length === 0) return 0;
  if (!holidays?.regular?.dates) return 0;

  let totalCount = 0;

  timeEntries.forEach(({ date, timeIn, timeOut }) => {
    if (!isRegularHoliday(date, holidays)) return;

    const workedOnHoliday = isValidTimeEntry(timeIn, timeOut);

    // Find the nearest valid workday before the holiday
    let prevWorkDay = subDays(new Date(date), 1);
    while (isSunday(prevWorkDay)) {
      prevWorkDay = subDays(prevWorkDay, 1);
    }
    const workedBefore = timeEntries.some(
      ({ date: prevDate, timeIn, timeOut }) =>
        new Date(prevDate).toDateString() === prevWorkDay.toDateString() &&
        isValidTimeEntry(timeIn, timeOut)
    );

    // Find the nearest valid workday after the holiday
    let nextWorkDay = addDays(new Date(date), 1);
    while (isSunday(nextWorkDay)) {
      nextWorkDay = addDays(nextWorkDay, 1);
    }
    const workedAfter = timeEntries.some(
      ({ date: nextDate, timeIn, timeOut }) =>
        new Date(nextDate).toDateString() === nextWorkDay.toDateString() &&
        isValidTimeEntry(timeIn, timeOut)
    );

    if (workedOnHoliday) {
      totalCount += 2; // Double Pay
    } else if (workedBefore && workedAfter) {
      totalCount += 1; // Paid Holiday
    }
  });

  return totalCount;
}

/**
 * Calculates the total count of **special non-working holidays** an employee qualifies for.
 * @param {TimeEntry[]} timeEntries - List of employee time entries.
 * @param {Holidays} holidays - Object containing holiday dates.
 * @returns {number} Total count of special non-working holiday payments.
 */
export function calculateTotalSpecialNonWorkingHoliday(
  timeEntries: TimeEntry[],
  holidays: Holidays
): number {
  if (!Array.isArray(timeEntries) || timeEntries.length === 0) return 0;
  if (!holidays?.specialNonWorkingHoliday?.dates) return 0;

  let totalCount = 0;

  timeEntries.forEach(({ date, timeIn, timeOut }) => {
    if (!isSpecialNonWorkingHoliday(date, holidays)) return;

    const workedOnHoliday = isValidTimeEntry(timeIn, timeOut);

    if (workedOnHoliday) {
      totalCount += 1; // 130% pay
    }
  });

  return totalCount;
}

/**
 * Calculates the total count of **special working holidays** an employee qualifies for.
 * @param {TimeEntry[]} timeEntries - List of employee time entries.
 * @param {Holidays} holidays - Object containing holiday dates.
 * @returns {number} Total count of special working holiday payments.
 */
export function calculateTotalSpecialWorkingHoliday(
  timeEntries: TimeEntry[],
  holidays: Holidays
): number {
  if (!timeEntries?.length || !holidays?.specialWorkingHoliday?.dates) return 0;

  let totalCount = 0;

  timeEntries.forEach(({ date, timeIn, timeOut }) => {
    if (!isSpecialWorkingHoliday(date, holidays)) return;

    const workedOnHoliday = isValidTimeEntry(timeIn, timeOut);

    if (workedOnHoliday) {
      totalCount += 1; // No premium
    }
  });

  return totalCount;
}

/**
 * Checks if a given date is a **regular holiday**.
 * @param {string} date - The date in YYYY-MM-DD format.
 * @param {Holidays} holidays - Object containing holiday dates.
 * @returns {boolean} `true` if the date is a regular holiday, otherwise `false`.
 */
export function isRegularHoliday(date: string, holidays: Holidays): boolean {
  return holidays.regular.dates.has(date);
}

/**
 * Checks if a given date is a **special non-working holiday**.
 * @param {string} date - The date in YYYY-MM-DD format.
 * @param {Holidays} holidays - Object containing holiday dates.
 * @returns {boolean} `true` if the date is a special non-working holiday, otherwise `false`.
 */
export function isSpecialNonWorkingHoliday(date: string, holidays: Holidays): boolean {
  return holidays.specialNonWorkingHoliday.dates.has(date);
}

/**
 * Checks if a given date is a **special working holiday**.
 * @param {string} date - The date in YYYY-MM-DD format.
 * @param {Holidays} holidays - Object containing holiday dates.
 * @returns {boolean} `true` if the date is a special working holiday, otherwise `false`.
 */
export function isSpecialWorkingHoliday(date: string, holidays: Holidays): boolean {
  return holidays.specialWorkingHoliday.dates.has(date);
}
