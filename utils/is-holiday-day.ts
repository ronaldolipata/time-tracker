import {
  isRegularHoliday,
  isSpecialNonWorkingHoliday,
  isSpecialWorkingHoliday,
} from '@/helpers/holiday-helper';
import { Holidays } from '@/context/types';

export function isHolidayDay(date: string, holidays: Holidays) {
  return (
    isRegularHoliday(date, holidays) ||
    isSpecialNonWorkingHoliday(date, holidays) ||
    isSpecialWorkingHoliday(date, holidays)
  );
}
