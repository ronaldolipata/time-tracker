import { isSunday } from 'date-fns';

export function isSundayDay(date: string): boolean {
  return isSunday(new Date(date));
}
