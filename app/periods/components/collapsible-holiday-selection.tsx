'use client';

import { useState, useEffect } from 'react';
import { useTimeTracker } from '@/context/time-tracker-context';
import { Button } from '@/components/ui/button';
import { Holidays } from '@/context/types';
import { addDays, format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import DayColorIndicator from '@/components/day-color-indicator';
import { getTableRowBackgroundClass } from '@/helpers/get-table-row-background-class';
import { formatDate } from '@/utils/format-date';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleHolidaySelectionProps {
  isEditMode?: boolean;
  datesChanged?: boolean;
  tempHolidays: Holidays;
  setTempHolidays: React.Dispatch<React.SetStateAction<Holidays>>;
}

export default function CollapsibleHolidaySelection({
  isEditMode = false,
  datesChanged = false,
  tempHolidays,
  setTempHolidays,
}: CollapsibleHolidaySelectionProps) {
  const { startDate, endDate, dates, setDates } = useTimeTracker();
  const [isExpanded, setIsExpanded] = useState(false);

  function getDatesInRange(start: Date, end: Date): string[] {
    const dates = [];
    let current = start;
    while (current <= end) {
      dates.push(format(current, 'MM/dd/yyyy'));
      current = addDays(current, 1);
    }
    return dates;
  }

  // Initialize dates and temporary holidays when expanded
  useEffect(() => {
    if (isExpanded && startDate && endDate) {
      // Generate dates from the existing start and end dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      const datesInRange = getDatesInRange(start, end);
      setDates(datesInRange);
    }
  }, [isExpanded, startDate, endDate, setDates]);

  // Reset expanded state when dates change
  useEffect(() => {
    if (datesChanged) {
      setIsExpanded(false);
    }
  }, [datesChanged]);

  function handleHolidayCheckboxChange(date: string, type: keyof Holidays): void {
    setTempHolidays((prev: Holidays) => {
      const updatedHolidays: Holidays = {
        regular: { dates: new Set<string>(prev.regular.dates) },
        specialNonWorkingHoliday: { dates: new Set<string>(prev.specialNonWorkingHoliday.dates) },
        specialWorkingHoliday: { dates: new Set<string>(prev.specialWorkingHoliday.dates) },
      };

      // Toggle selection: If already present, remove it; otherwise, move it to the selected category
      if (updatedHolidays[type].dates.has(date)) {
        updatedHolidays[type].dates.delete(date);
      } else {
        // Remove from all categories
        updatedHolidays.regular.dates.delete(date);
        updatedHolidays.specialNonWorkingHoliday.dates.delete(date);
        updatedHolidays.specialWorkingHoliday.dates.delete(date);

        // Add to selected category
        updatedHolidays[type].dates.add(date);
      }

      // Convert to sorted array, then back to Set
      updatedHolidays[type].dates = new Set<string>(
        [...updatedHolidays[type].dates].sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        )
      );

      return updatedHolidays;
    });
  }

  return (
    <div className='flex flex-col gap-6'>
      <Button
        className='lg:self-end focus:bg-blue-900 hover:bg-blue-900 cursor-pointer flex items-center gap-2'
        disabled={!isEditMode && (!startDate || !endDate)}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Set holidays
        {isExpanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
      </Button>

      {isExpanded && (
        <div className='grid gap-6'>
          <div className='grid gap-2'>
            <h3 className='text-lg font-semibold'>Set Holidays</h3>
            <p className='text-sm text-gray-600'>
              Select dates to mark as holidays. You can choose between regular holidays, special
              non-working holidays, and special working holidays.
            </p>
          </div>
          <DayColorIndicator />
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='pl-4'>Date</TableHead>
                  <TableHead className='p-2 text-center'>Regular</TableHead>
                  <TableHead className='p-2 text-center'>Special Non-working</TableHead>
                  <TableHead className='p-2 text-center'>Special Working</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dates.map((date) => (
                  <TableRow key={date} className={getTableRowBackgroundClass(date, tempHolidays)}>
                    <TableCell className='pl-4'>{formatDate(date)}</TableCell>
                    <TableCell className='p-2 text-center'>
                      <Input
                        type='checkbox'
                        checked={tempHolidays.regular.dates.has(date)}
                        onChange={() => handleHolidayCheckboxChange(date, 'regular')}
                        className='h-6 shadow-none'
                      />
                    </TableCell>
                    <TableCell className='p-2 text-center'>
                      <Input
                        type='checkbox'
                        checked={tempHolidays.specialNonWorkingHoliday.dates.has(date)}
                        onChange={() =>
                          handleHolidayCheckboxChange(date, 'specialNonWorkingHoliday')
                        }
                        className='h-6 shadow-none'
                      />
                    </TableCell>
                    <TableCell className='p-2 text-center'>
                      <Input
                        type='checkbox'
                        checked={tempHolidays.specialWorkingHoliday.dates.has(date)}
                        onChange={() => handleHolidayCheckboxChange(date, 'specialWorkingHoliday')}
                        className='h-6 shadow-none'
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
