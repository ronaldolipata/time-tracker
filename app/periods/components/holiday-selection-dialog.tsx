'use client';

import { useState, useEffect } from 'react';
import { useTimeTracker } from '@/context/time-tracker-context';
import { Button } from '@/components/ui/button';
import { Holidays } from '@/context/types';
import { addDays, format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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

interface HolidaySelectionDialogProps {
  isEditMode?: boolean;
  datesChanged?: boolean;
}

export default function HolidaySelectionDialog({
  isEditMode = false,
  datesChanged = false,
}: HolidaySelectionDialogProps) {
  const {
    startDate,
    endDate,
    dates,
    holidays,
    setHolidays,
    setDates,
    setIsHolidaySelectionVisible,
  } = useTimeTracker();
  const [tempHolidays, setTempHolidays] = useState<Holidays>({
    regular: { dates: new Set() },
    specialNonWorkingHoliday: { dates: new Set() },
    specialWorkingHoliday: { dates: new Set() },
  });
  const [isOpen, setIsOpen] = useState(false);

  function getDatesInRange(start: Date, end: Date): string[] {
    const dates = [];
    let current = start;
    while (current <= end) {
      dates.push(format(current, 'MM/dd/yyyy'));
      current = addDays(current, 1);
    }
    return dates;
  }

  // Initialize dates and temporary holidays when dialog opens
  useEffect(() => {
    if (isOpen && startDate && endDate) {
      // Generate dates from the existing start and end dates
      const start = new Date(startDate);
      const end = new Date(endDate);
      const datesInRange = getDatesInRange(start, end);
      setDates(datesInRange);

      // Initialize temporary holidays from the context
      setTempHolidays({
        regular: { dates: new Set(holidays.regular.dates) },
        specialNonWorkingHoliday: { dates: new Set(holidays.specialNonWorkingHoliday.dates) },
        specialWorkingHoliday: { dates: new Set(holidays.specialWorkingHoliday.dates) },
      });
    }
  }, [isOpen, startDate, endDate, holidays, setDates]);

  // Reset dialog state when dates change
  useEffect(() => {
    if (datesChanged) {
      setIsOpen(false);
    }
  }, [datesChanged]);

  function handleHolidayCheckboxChange(date: string, type: keyof Holidays): void {
    setTempHolidays((prev) => {
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

  function handleSave() {
    setHolidays(tempHolidays);
    setIsOpen(false);
    setIsHolidaySelectionVisible(true);
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          className='lg:self-end focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'
          disabled={!isEditMode && (!startDate || !endDate)}
        >
          Set Holidays
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='max-w-4xl'>
        <AlertDialogHeader>
          <AlertDialogTitle>Set Holidays</AlertDialogTitle>
          <AlertDialogDescription>
            Select dates to mark as holidays. You can choose between regular holidays, special
            non-working holidays, and special working holidays.
          </AlertDialogDescription>
        </AlertDialogHeader>
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
                      onChange={() => handleHolidayCheckboxChange(date, 'specialNonWorkingHoliday')}
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
        <div className='flex justify-end'>
          <Button className='cursor-pointer' onClick={handleSave}>
            Save
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
