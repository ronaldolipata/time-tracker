'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTimeTracker } from '@/context/TimeTrackerContext';
import { CustomLink } from '@/components/CustomLink';
import { DynamicBreadcrumbs } from '@/components/DynamicBreadcrumbs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';

export default function Create() {
  const {
    handleCreateProject,
    projectLocation,
    projectStatus,
    projectName,
    setProjectLocation,
    setProjectStatus,
    setProjectName,
    projectData,
  } = useTimeTracker();
  const router = useRouter();

  function handleCreate(projectLocation: string, projectName: string, projectStatus: string) {
    const success = handleCreateProject(projectLocation, projectName, projectStatus);

    if (success) {
      // App Router uses searchParams via URL construction
      router.push(
        `/projects?success=${encodeURIComponent('Project has been successfully created')}`
      );
    }
  }

  useEffect(() => {
    console.log(projectData);
  }, [projectData]);

  return (
    <>
      <ToastContainer />
      <div className='flex flex-col gap-6 py-6'>
        <div className='flex flex-col gap-2'>
          <DynamicBreadcrumbs />
          <h1 className='text-3xl font-bold'>Create Projects</h1>
        </div>
        <Card className='w-full gap-0 p-0'>
          <div className='flex flex-col gap-2 border-b p-6'>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Create project projectLocation, and project name. These will be used to separate time
              entries of the employees.
            </CardDescription>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 p-6'>
            <div className='flex flex-col gap-2'>
              {/* @TODO: Dynamic indicator for required fields */}
              <Label className='text-sm font-semibold'>
                Location <span className='text-red-600'>*</span>
              </Label>
              <Input
                type='text'
                className='w-full min-h-8 text-sm border cursor-pointer'
                placeholder='Enter the project location'
                value={projectLocation}
                onChange={(e) => setProjectLocation(e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-2'>
              {/* @TODO: Dynamic indicator for required fields */}
              <Label className='text-sm font-semibold'>
                Name <span className='text-red-600'>*</span>
              </Label>
              <Input
                type='text'
                className='w-full min-h-8 text-sm border cursor-pointer'
                placeholder='Enter the project name'
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-2'>
              {/* @TODO: Dynamic indicator for required fields */}
              <Label className='text-sm font-semibold'>
                Status <span className='text-red-600'>*</span>
              </Label>
              <RadioGroup
                defaultValue='enable'
                className='flex'
                onValueChange={(value) => setProjectStatus(value)}
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='enable' id='enable' />
                  <Label htmlFor='enable'>Enable</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='disable' id='disable' />
                  <Label htmlFor='disable'>Disable</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </Card>
        <div className='flex flex-col lg:flex-row gap-2'>
          <Button
            className='cursor-pointer'
            onClick={() => handleCreate(projectLocation, projectName, projectStatus)}
            disabled={!projectLocation || !projectName || !projectStatus}
          >
            Create
          </Button>
          <Button
            className='cursor-pointer'
            onClick={() => handleCreateProject(projectLocation, projectName, projectStatus)}
            disabled={!projectLocation || !projectName || !projectStatus}
            variant={'outline'}
          >
            Create & create another
          </Button>
          <CustomLink href='/projects' className='cursor-pointer' variant={'outline'}>
            Cancel
          </CustomLink>
        </div>
      </div>
    </>
  );
}
