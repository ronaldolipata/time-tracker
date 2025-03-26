import { format } from 'date-fns';

export function formatPeriod(date: Date) {
  return `${format(date, 'MMMM dd, yyyy')}`;
}
