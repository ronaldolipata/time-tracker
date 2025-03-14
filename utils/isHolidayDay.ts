import {
  isRegularHoliday,
  isSpecialNonWorkingHoliday,
  isSpecialWorkingHoliday,
} from '@/helpers/holidayHelper';
import Holidays from '@/types/Holidays';

export function isHolidayDay(date: string, holidays: Holidays) {
  return (
    isRegularHoliday(date, holidays) ||
    isSpecialNonWorkingHoliday(date, holidays) ||
    isSpecialWorkingHoliday(date, holidays)
  );
}
