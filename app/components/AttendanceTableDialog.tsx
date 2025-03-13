import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TimeEntry } from '@/types/EmployeeData';
import { isSunday } from 'date-fns';
import Holidays from '@/types/Holidays';
import {
  isRegularHoliday,
  isSpecialNonWorkingHoliday,
  isSpecialWorkingHoliday,
} from '@/helpers/holidayHelper';

type AttendanceTableDialogProps = {
  holidays: Holidays;
  name: string;
  timeEntries: TimeEntry[];
};

export default function AttendanceTableDialog({
  holidays,
  name,
  timeEntries,
}: AttendanceTableDialogProps) {
  function getBackgroundColor({ date }: TimeEntry) {
    const classes = [];

    if (isSunday(new Date(date))) {
      classes.push('bg-red-200');
    }

    if (
      isRegularHoliday(date, holidays) ||
      isSpecialNonWorkingHoliday(date, holidays) ||
      isSpecialWorkingHoliday(date, holidays)
    ) {
      classes.push('bg-blue-200');
    }

    return classes.join(' '); // Combine multiple classes
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'>
          Show attendance table
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='font-bold text-blue-900'>{name}</DialogTitle>
        </DialogHeader>
        <Table className='w-full border-collapse border text-center'>
          <TableHeader>
            <TableRow className='uppercase bg-gray-300'>
              <TableHead className='text-center'>Date</TableHead>
              <TableHead className='text-center'>Time In</TableHead>
              <TableHead className='text-center'>Time Out</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeEntries.map((entry, index) => (
              <TableRow className={getBackgroundColor(entry)} key={index}>
                <TableCell className='border p-2'>{entry.date}</TableCell>
                <TableCell className='border p-2'>{entry.timeIn}</TableCell>
                <TableCell className='border p-2'>{entry.timeOut}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogFooter className='sm:justify-end'>
          <DialogClose asChild>
            <Button type='button' variant='secondary' className='cursor-pointer'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
