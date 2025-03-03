import React from 'react';
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
import { EmployeeData } from '@/types/EmployeeData';
import { isSunday } from 'date-fns';

const AttendanceTableDialog: React.FC<EmployeeData> = ({ name, timeEntries }: EmployeeData) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'>
          Show Attendance Table
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
        </DialogHeader>
        <Table className='w-full border-collapse border'>
          <TableHeader>
            <TableRow className='uppercase bg-gray-300'>
              <TableHead>Date</TableHead>
              <TableHead>Time In</TableHead>
              <TableHead>Time Out</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timeEntries.map((entry, index) => (
              <TableRow className={isSunday(new Date(entry.date)) ? 'bg-red-200' : ''} key={index}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.timeIn}</TableCell>
                <TableCell>{entry.timeOut}</TableCell>
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
};

export default AttendanceTableDialog;
