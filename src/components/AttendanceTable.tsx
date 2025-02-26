import React from 'react';
import { EmployeeData } from '../types/EmployeeData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from './ui/card';
import { isSunday } from 'date-fns';

type AttendanceTableProps = {
  employeeData: EmployeeData[];
};

const AttendanceTable: React.FC<AttendanceTableProps> = ({ employeeData }) => {
  return (
    <div className='flex gap-4 flex-wrap'>
      {employeeData.map(({ name, timeEntries, summary }: EmployeeData) => (
        <div key={name} className='w-[calc(50%-0.5rem)] border p-4 rounded shadow'>
          <h3 className='mb-2 text-lg font-semibold'>{name}</h3>
          <div className='flex gap-4'>
            <Table className='w-full border-collapse border'>
              <TableHeader>
                <TableRow className='uppercase bg-gray-300'>
                  <TableHead className='border p-1 text-center'>Date</TableHead>
                  <TableHead className='border p-1 text-center'>Time In</TableHead>
                  <TableHead className='border p-1 text-center'>Time Out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeEntries.map((entry, index) => (
                  <TableRow
                    className={isSunday(new Date(entry.date)) ? 'bg-red-200' : ''}
                    key={index}
                  >
                    <TableCell className='border p-1 text-center'>{entry.date}</TableCell>
                    <TableCell className='border p-1 text-center'>{entry.timeIn}</TableCell>
                    <TableCell className='border p-1 text-center'>{entry.timeOut}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Card className='w-full max-w-[12rem] self-start gap-0 p-0 text-center'>
              <p className='p-4 odd:bg-sky-100 even:bg-white p-2'>
                Total Regular Days:
                <span className='block font-bold'>{summary.totalRegularWorkDays} day(s)</span>
              </p>
              <p className='p-4 odd:bg-gray-100 even:bg-white p-2'>
                Total Sunday Days:
                <span className='block font-bold'>{summary.totalSundayDays} day(s)</span>
              </p>
              <p className='p-4 odd:bg-sky-100 even:bg-white p-2'>
                Total Sunday OT:
                <span className='block font-bold'>{summary.totalSundayOvertime} day(s)</span>
              </p>
              <p className='p-4 odd:bg-gray-100 even:bg-white p-2'>
                Total Regular OT:
                <span className='block font-bold'>{summary.totalRegularOvertime} day(s)</span>
              </p>
            </Card>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendanceTable;
