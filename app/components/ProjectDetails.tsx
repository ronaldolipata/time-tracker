import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTimeTracker } from '@/context/TimeTrackerContext';

export default function ProjectDetails() {
  const {
    handleEnterProjectDetails,
    handleClearProjectDetails,
    location,
    projectName,
    setLocation,
    setProjectName,
  } = useTimeTracker();

  return (
    <Card className='w-full gap-4 p-4'>
      <div className='flex flex-col gap-2'>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>Enter project details</CardDescription>
      </div>
      <div className='flex flex-col lg:flex-row gap-4'>
        <Input
          type='text'
          className='w-full min-h-8 text-sm border cursor-pointer'
          placeholder='Enter the project location'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <Input
          type='text'
          className='w-full min-h-8 text-sm border cursor-pointer'
          placeholder='Enter the project name'
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
        <div className='flex flex-col lg:flex-row gap-1'>
          <Button
            className='focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'
            onClick={() => handleEnterProjectDetails(location, projectName)}
            disabled={!location || !projectName}
          >
            Enter
          </Button>
          <Button
            className='cursor-pointer'
            variant={'secondary'}
            onClick={() => handleClearProjectDetails()}
            disabled={!location || !projectName}
          >
            Clear
          </Button>
        </div>
      </div>
    </Card>
  );
}
