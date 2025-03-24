import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTimeTracker } from '@/context/TimeTrackerContext';
import React from 'react';
import HolidaySelectionDialog from './HolidaySelectionDialog';
import { Label } from '@/components/ui/label';

export default function PayrollPeriod() {
  const { isPayrollPeriodEnabled, startDate, endDate, setStartDate, setEndDate } = useTimeTracker();

  return (
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
            disabled={isPayrollPeriodEnabled ? false : true}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <Label className='text-sm'>End Date:</Label>
          <Input
            className='flex justify-center'
            type='date'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isPayrollPeriodEnabled ? false : true}
          />
        </div>
        <HolidaySelectionDialog />
      </div>
    </Card>
  );
}
