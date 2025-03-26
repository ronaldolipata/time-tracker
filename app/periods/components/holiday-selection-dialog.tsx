import { useState, useEffect } from 'react';
import { useTimeTracker } from '@/context/time-tracker-context';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
import { Holidays } from '@/context/types';
import { addDays, format } from 'date-fns';

export default function HolidaySelectionDialog() {
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
  const [open, setOpen] = useState(false);

  function getDatesInRange(start: Date, end: Date): string[] {
    const dates = [];
    let current = start;
    while (current <= end) {
      dates.push(format(current, 'MM/dd/yyyy'));
      current = addDays(current, 1);
    }
    return dates;
  }

  // Initialize temporary holidays and generate dates when dialog opens
  useEffect(() => {
    if (open && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      setDates(getDatesInRange(start, end));

      setTempHolidays({
        regular: { dates: new Set(holidays.regular.dates) },
        specialNonWorkingHoliday: { dates: new Set(holidays.specialNonWorkingHoliday.dates) },
        specialWorkingHoliday: { dates: new Set(holidays.specialWorkingHoliday.dates) },
      });
    }
  }, [open, startDate, endDate, holidays, setDates]);

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
    setOpen(false);
    setIsHolidaySelectionVisible(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className='lg:self-end focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'
          disabled={!startDate || !endDate}
        >
          Set Holidays
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='font-bold text-blue-900'>Holiday Selection</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
