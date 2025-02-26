import React from 'react';
import Holidays from '@/types/Holidays';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { isSunday } from 'date-fns';

type DateSelectionProps = {
  holidays: Holidays;
  setHolidays: React.Dispatch<React.SetStateAction<Holidays>>;
  dates: string[];
  setShowTimeEntries: React.Dispatch<React.SetStateAction<boolean>>;
  setShowHolidaySelection: React.Dispatch<React.SetStateAction<boolean>>;
};

const HolidaySelection: React.FC<DateSelectionProps> = ({
  holidays,
  setHolidays,
  dates,
  setShowTimeEntries,
  setShowHolidaySelection,
}) => {
  const handleHolidayCheckboxChange = (date: string, type: keyof Holidays): void => {
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
  };

  const handleSetShowTimeEntries = (): void => {
    setShowTimeEntries(true);
    setShowHolidaySelection(false);
  };

  return (
    <div className='flex flex-col'>
      <Table className='w-full border-collapse border mb-4'>
        <TableHeader>
          <TableRow className='bg-gray-200'>
            <TableHead className='border p-2 text-center'>Date</TableHead>
            <TableHead className='border p-2 text-center'>Regular Holiday</TableHead>
            <TableHead className='border p-2 text-center'>Special Non-working</TableHead>
            <TableHead className='border p-2 text-center'>Special Working</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dates.map((date) => (
            <TableRow key={date} className={isSunday(new Date(date)) ? 'bg-red-200' : ''}>
              <TableCell className='border p-2 text-center'>{date}</TableCell>
              <TableCell className='border p-2 text-center'>
                <Input
                  type='checkbox'
                  checked={holidays.regular.dates.has(date)}
                  onChange={() => handleHolidayCheckboxChange(date, 'regular')}
                  className='h-6 shadow-none'
                />
              </TableCell>
              <TableCell className='border p-2 text-center'>
                <Input
                  type='checkbox'
                  checked={holidays.specialNonWorkingHoliday.dates.has(date)}
                  onChange={() => handleHolidayCheckboxChange(date, 'specialNonWorkingHoliday')}
                  className='h-6 shadow-none'
                />
              </TableCell>
              <TableCell className='border p-2 text-center'>
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

      <Button className='self-end mt-4' onClick={handleSetShowTimeEntries}>
        Proceed to Input Time In and Time Out
      </Button>
    </div>
  );
};

export default HolidaySelection;
