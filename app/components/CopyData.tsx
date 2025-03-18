import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useTimeTracker } from '@/context/TimeTrackerContext';
import React from 'react';

export default function CopyData() {
  const { isAttendanceTableVisible, handleCopy } = useTimeTracker();

  return (
    <Card className='w-full md:max-w-[12rem] flex-col gap-4 p-4 text-center'>
      <div className='flex flex-col gap-2'>
        <CardTitle>Data</CardTitle>
        <CardDescription>Press CTRL + C to copy</CardDescription>
      </div>
      <Button
        className={`mt-auto focus:bg-blue-900 hover:bg-blue-900 ${
          isAttendanceTableVisible ? 'cursor-pointer' : 'cursor-not-allowed'
        }`}
        onClick={handleCopy}
        variant={isAttendanceTableVisible ? 'default' : 'ghost'}
        disabled={isAttendanceTableVisible ? false : true}
      >
        Copy data
      </Button>
    </Card>
  );
}
