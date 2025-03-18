import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTimeTracker } from '@/context/TimeTrackerContext';
import React from 'react';

export default function PayrollPeriod() {
  const { startDate, endDate, setStartDate, setEndDate, handleApplyDates } = useTimeTracker();

  return (
    <Card className='w-full lg:w-auto gap-4 p-4'>
      <CardTitle>Payroll Period</CardTitle>
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='flex flex-col gap-2'>
          <label className='text-sm'>Start Date:</label>
          <Input
            className='flex justify-center'
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm'>End Date:</label>
          <Input
            className='flex justify-center'
            type='date'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <Button
          className='md:self-end focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'
          onClick={() => handleApplyDates(startDate, endDate)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleApplyDates(startDate, endDate);
            }
          }}
        >
          Apply
        </Button>
      </div>
    </Card>
  );
}
