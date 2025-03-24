import { Holidays, Summary, TimeEntry } from '@/context/types';
import { calculateTotalRegularWorkDays, calculateTotalSundayWorkDays } from './workday-helper';
import {
  calculateRegularOvertime,
  calculateTotalRegularHolidayOvertime,
  calculateTotalSundayOvertime,
} from './overtime-helper';
import {
  calculateTotalRegularHoliday,
  calculateTotalSpecialNonWorkingHoliday,
  calculateTotalSpecialWorkingHoliday,
} from './holiday-helper';

export function calculateSummary(timeEntries: TimeEntry[], holidays: Holidays): Summary {
  return {
    totalRegularWorkDays: calculateTotalRegularWorkDays(timeEntries, holidays),
    totalSundayDays: calculateTotalSundayWorkDays(timeEntries, holidays),
    totalSundayOvertime: calculateTotalSundayOvertime(timeEntries),
    totalRegularOvertime: calculateRegularOvertime(timeEntries),
    totalRegularHoliday: calculateTotalRegularHoliday(timeEntries, holidays),
    totalRegularHolidayOvertime: calculateTotalRegularHolidayOvertime(timeEntries, holidays),
    totalSpecialNonWorkingHoliday: calculateTotalSpecialNonWorkingHoliday(timeEntries, holidays),
    totalSpecialWorkingHoliday: calculateTotalSpecialWorkingHoliday(timeEntries, holidays),
  };
}
