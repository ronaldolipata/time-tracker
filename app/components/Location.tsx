import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import React from 'react';

export default function Location() {
  return (
    <Card className='gap-4 p-4'>
      <div className='flex flex-col gap-2'>
        <CardTitle>Project Details</CardTitle>
      </div>
      <div className='flex gap-4'>
        <div className='flex flex-col gap-2'>
          <label className='text-sm'>Location:</label>
          <Input
            type='text'
            className={'w-full min-h-8 border p-2 placeholder:text-sm cursor-pointer'}
            placeholder='Enter the location'
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm'>Project Name:</label>
          <Input
            type='text'
            className={'w-full min-h-8 border p-2 placeholder:text-sm cursor-pointer'}
            placeholder='Enter the project name'
          />
        </div>
        <Button className='md:self-end focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'>
          Enter
        </Button>
      </div>
    </Card>
  );
}
