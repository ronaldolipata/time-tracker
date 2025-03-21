import { Holidays } from '@/context/types';
import { isHolidayDay } from '@/utils/isHolidayDay';
import { isSundayDay } from '@/utils/isSundayDay';

export function getTableRowBackgroundClass(date: string, holidays: Holidays): string {
  const isSunday = isSundayDay(date);
  const isHoliday = isHolidayDay(date, holidays);

  if (isSunday && isHoliday) {
    return 'bg-purple-200 hover:bg-purple-300';
  } else if (isSunday) {
    return 'bg-red-200 hover:bg-red-300';
  } else if (isHoliday) {
    return 'bg-blue-200 hover:bg-blue-300';
  } else {
    return '';
  }
}
