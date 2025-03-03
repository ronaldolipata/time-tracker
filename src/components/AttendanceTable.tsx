import React from 'react';
import { EmployeeData } from '../types/EmployeeData';
import { Card } from './ui/card';
import addEllipsis from '@/helpers/addEllipsis';
import AttendanceTableDialog from './AttendanceTableDialog';

type AttendanceTableProps = {
  employeeData: EmployeeData[];
};

const AttendanceTable: React.FC<AttendanceTableProps> = ({ employeeData }) => {
  return (
    <div className='flex flex-wrap gap-4'>
      {employeeData.map(({ name, timeEntries, summary }: EmployeeData) => (
        <Card key={name} className='w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(19.68%-0.5rem)] p-4'>
          <h3 className='text-lg font-bold text-center text-blue-900'>{addEllipsis(20, name)}</h3>
          <div className='flex flex-col gap-4'>
            <div className='w-full self-start gap-0 text-center'>
              <p className='p-4 odd:bg-sky-100 even:bg-white p-2 rounded-xl'>
                Total Regular Days:
                <span className='block font-bold'>
                  {summary.totalRegularWorkDays !== 0 ? summary.totalRegularWorkDays + 'D' : '-'}
                </span>
              </p>
              <p className='p-4 odd:bg-gray-100 even:bg-white p-2 rounded-xl'>
                Total Sunday Days:
                <span className='block font-bold'>
                  {summary.totalSundayDays !== 0 ? summary.totalSundayDays + 'D' : '-'}
                </span>
              </p>
              <p className='p-4 odd:bg-sky-100 even:bg-white p-2 rounded-xl'>
                Total Sunday OT:
                <span className='block font-bold'>
                  {summary.totalSundayOvertime !== 0 ? summary.totalSundayOvertime + 'D' : '-'}
                </span>
              </p>
              <p className='p-4 odd:bg-gray-100 even:bg-white p-2 rounded-xl'>
                Total Regular OT:
                <span className='block font-bold'>
                  {summary.totalRegularOvertime !== 0 ? summary.totalRegularOvertime + 'H' : '-'}
                </span>
              </p>
            </div>

            <AttendanceTableDialog name={name} timeEntries={timeEntries} summary={summary} />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AttendanceTable;
