import { isValidTimeEntry } from '@/utils/isValidTimeEntry';
import { TimeEntry } from '../types/EmployeeData';
import Holidays from '@/types/Holidays';

export const calculateTotalRegularHoliday = (
  timeEntries: TimeEntry[],
  holidays: Holidays
): number => {
  if (!timeEntries?.length || !holidays?.regular?.dates) {
    return 0;
  }

  let totalCount = 0;

  timeEntries.forEach((entry, index) => {
    if (!isRegularHoliday(entry.date, holidays)) return;

    const workedOnHoliday = isValidTimeEntry(entry.timeIn, entry.timeOut);
    const workedBefore =
      index > 0 && isValidTimeEntry(timeEntries[index - 1].timeIn, timeEntries[index - 1].timeOut);
    const workedAfter =
      index < timeEntries.length - 1 &&
      isValidTimeEntry(timeEntries[index + 1].timeIn, timeEntries[index + 1].timeOut);

    if (workedOnHoliday) {
      totalCount += 2; // Double Pay
    } else if (workedBefore && workedAfter) {
      totalCount += 1; // Paid Holiday
    }
  });

  return totalCount;
};

export const isRegularHoliday = (date: string, holidays: Holidays): boolean => {
  return holidays.regular.dates.has(date);
};
