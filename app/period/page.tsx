'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTimeTracker } from '@/context/time-tracker-context';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HolidaySelectionDialog from './components/holiday-selection-dialog';

export default function Period() {
  const { startDate, endDate, setStartDate, setEndDate } = useTimeTracker();

  return (
    <>
      <ToastContainer />
      <Card className='w-full lg:w-auto gap-4 p-4'>
        <CardTitle>Payroll Period</CardTitle>
        <div className='flex flex-col lg:flex-row gap-4'>
          <div className='flex flex-col gap-2'>
            <Label className='text-sm'>Start Date:</Label>
            <Input
              className='flex justify-center'
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <Label className='text-sm'>End Date:</Label>
            <Input
              className='flex justify-center'
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <HolidaySelectionDialog />
        </div>
      </Card>
    </>
  );
}
