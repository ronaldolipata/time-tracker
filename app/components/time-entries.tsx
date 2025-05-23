import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTimeTracker } from '@/context/time-tracker-context';
import React from 'react';

export default function TimeEntries() {
  const { isTimeEntriesEnabled, handlePaste } = useTimeTracker();

  return (
    <Card className='w-full min-w-[189px] gap-5 grow-1 p-5'>
      <div className='flex flex-col gap-2'>
        <CardTitle>Time Entries</CardTitle>
        <CardDescription>e.g. DOE, JOHN 8:00 AM 5:00 PM</CardDescription>
      </div>
      <Input
        type='text'
        className={`w-full min-h-8 border p-2 placeholder:text-sm ${
          isTimeEntriesEnabled ? 'cursor-pointer' : 'cursor-not-allowed'
        }`}
        placeholder='Paste the time in, and time out data here...'
        onPaste={handlePaste}
        disabled={isTimeEntriesEnabled ? false : true}
      />
    </Card>
  );
}
