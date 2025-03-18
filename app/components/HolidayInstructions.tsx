import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import React from 'react';

export default function HolidayInstructions() {
  return (
    <Card className='gap-4 p-4'>
      <div className='flex flex-col gap-2'>
        <CardTitle>Holiday Instructions</CardTitle>
        <CardDescription>
          Holiday numbers represent pay types and are added up to get the total holiday pay.
        </CardDescription>
      </div>
      <div className='flex flex-col md:flex-row gap-4'>
        <Card className='md:flex-1 gap-2 p-4 text-sm text-gray-600'>
          <p className='font-semibold'>Regular Holiday</p>
          <p>1 → Paid (Worked before & after but did not work on the holiday)</p>
          <p>2 → Double Pay (Worked on the holiday itself)</p>
        </Card>
        <Card className='md:flex-1 gap-2 p-4 text-sm text-gray-600'>
          <p className='font-semibold'>Special Non-Working Holiday</p>
          <p>1 → 130% Pay (Worked on the holiday itself)</p>
        </Card>
        <Card className='md:flex-1 gap-2 p-4 text-sm text-gray-600'>
          <p className='font-semibold'>Special Working Holiday</p>
          <p>1 → Regular Pay (Worked on the holiday itself, no premium)</p>
        </Card>
      </div>
    </Card>
  );
}
