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
import { formatDate } from '@/utils/formatDate';
import DayColorIndicator from '@/components/DayColorIndicator';
import { getTableRowBackgroundClass } from '@/helpers/getTableRowBackgroundClass';
import { Holidays, TimeEntry } from '@/context/types';

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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'>
          Show attendance table
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle className='font-bold text-blue-900'>{name}</DialogTitle>
        </DialogHeader>
        <DayColorIndicator />
        <div className='rounded-md border'>
          <Table className='text-center'>
            <TableHeader>
              <TableRow>
                <TableHead className='pl-4'>Date</TableHead>
                <TableHead className='text-center'>Time-in</TableHead>
                <TableHead className='text-center'>Time-out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeEntries.map(({ date, timeIn, timeOut }, index) => {
                const formattedDate = formatDate(date);

                const holidayType = holidays.regular.dates.has(date)
                  ? ' (Regular Holiday)'
                  : holidays.specialNonWorkingHoliday.dates.has(date)
                  ? ' (Special Non-Working Holiday)'
                  : holidays.specialWorkingHoliday.dates.has(date)
                  ? ' (Special Working Holiday)'
                  : '';

                return (
                  <TableRow className={getTableRowBackgroundClass(date, holidays)} key={index}>
                    <TableCell className='pl-4 text-left'>{formattedDate + holidayType}</TableCell>
                    <TableCell className='p-2'>{timeIn}</TableCell>
                    <TableCell className='p-2'>{timeOut}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
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
