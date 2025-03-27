import { Holidays } from '@/context/types';
import { isHolidayDay } from '@/utils/is-holiday-day';
import { isSundayDay } from '@/utils/is-sunday-day';

export function getTableRowBackgroundClass(date: string, holidays: Holidays): string {
  const isSunday = isSundayDay(date);
  const isHoliday = isHolidayDay(date, holidays);

  if (isSunday && isHoliday) {
    return 'bg-purple-300 hover:bg-purple-400 text-purple-900';
  } else if (isSunday) {
    return 'bg-red-300 hover:bg-red-400 text-red-900';
  } else if (isHoliday) {
    return 'bg-blue-300 hover:bg-blue-400 text-blue-900';
  } else {
    return '';
  }
}
