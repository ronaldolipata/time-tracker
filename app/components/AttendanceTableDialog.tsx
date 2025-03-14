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
import Holidays from '@/types/Holidays';
import { formatDate } from '@/utils/formatDate';
import DayColorIndicator from '@/components/DayColorIndicator';
import { getTableRowBackgroundClass } from '@/helpers/getTableRowBackgroundClass';

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
      <DialogContent className='sm:max-w-md'>
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
              {timeEntries.map(({ date, timeIn, timeOut }, index) => (
                <TableRow className={getTableRowBackgroundClass(date, holidays)} key={index}>
                  <TableCell className='pl-4 text-left'>{formatDate(date)}</TableCell>
                  <TableCell className='p-2'>{timeIn}</TableCell>
                  <TableCell className='p-2'>{timeOut}</TableCell>
                </TableRow>
              ))}
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
