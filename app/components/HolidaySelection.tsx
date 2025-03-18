'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/formatDate';
import DayColorIndicator from '@/components/DayColorIndicator';
import { getTableRowBackgroundClass } from '@/helpers/getTableRowBackgroundClass';
import { Holidays } from '@/context/types';
import { useTimeTracker } from '@/context/TimeTrackerContext';

export default function HolidaySelection() {
  const { dates, setHolidays, holidays, setIsTimeEntriesEnabled, setShowHolidaySelection } =
    useTimeTracker();

  function handleHolidayCheckboxChange(date: string, type: keyof Holidays): void {
    setHolidays((prev) => {
      const updatedHolidays: Holidays = {
        regular: { dates: new Set(prev.regular.dates) },
        specialNonWorkingHoliday: { dates: new Set(prev.specialNonWorkingHoliday.dates) },
        specialWorkingHoliday: { dates: new Set(prev.specialWorkingHoliday.dates) },
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
      updatedHolidays[type].dates = new Set(
        [...updatedHolidays[type].dates].sort(
          (a, b) => new Date(a).getTime() - new Date(b).getTime()
        )
      );

      return updatedHolidays;
    });
  }

  function handleSetShowTimeEntries(): void {
    setIsTimeEntriesEnabled(true);
    setShowHolidaySelection(false);
  }

  return (
    <div className='flex flex-col gap-4'>
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
              <TableRow key={date} className={getTableRowBackgroundClass(date, holidays)}>
                <TableCell className='pl-4'>{formatDate(date)}</TableCell>
                <TableCell className='p-2 text-center'>
                  <Input
                    type='checkbox'
                    checked={holidays.regular.dates.has(date)}
                    onChange={() => handleHolidayCheckboxChange(date, 'regular')}
                    className='h-6 shadow-none'
                  />
                </TableCell>
                <TableCell className='p-2 text-center'>
                  <Input
                    type='checkbox'
                    checked={holidays.specialNonWorkingHoliday.dates.has(date)}
                    onChange={() => handleHolidayCheckboxChange(date, 'specialNonWorkingHoliday')}
                    className='h-6 shadow-none'
                  />
                </TableCell>
                <TableCell className='p-2 text-center'>
                  <Input
                    type='checkbox'
                    checked={holidays.specialWorkingHoliday.dates.has(date)}
                    onChange={() => handleHolidayCheckboxChange(date, 'specialWorkingHoliday')}
                    className='h-6 shadow-none'
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button
        className='self-end focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'
        onClick={handleSetShowTimeEntries}
      >
        Proceed to Input Time In and Time Out
      </Button>
    </div>
  );
}
