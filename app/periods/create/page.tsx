'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTimeTracker } from '@/context/time-tracker-context';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CollapsibleHolidaySelection from '../components/collapsible-holiday-selection';
import { Button } from '@/components/ui/button';
import { CustomLink } from '@/components/custom-link';
import { DynamicBreadcrumbs } from '@/components/dynamic-breadcrumbs';
import { useRouter } from 'next/navigation';

export default function Create() {
  const { startDate, endDate, setStartDate, setEndDate, handleCreatePayrollPeriod, setDates } =
    useTimeTracker();
  const router = useRouter();

  function handleCreate(startDate: string, endDate: string) {
    handleCreatePayrollPeriod(new Date(startDate), new Date(endDate));
    router.push(`/periods?success=${encodeURIComponent('Successfully created')}`);
  }

  function handleCreateAndCreateAnother(startDate: string, endDate: string) {
    handleCreatePayrollPeriod(new Date(startDate), new Date(endDate));
    // The form is already cleared by handleCreatePayrollPeriod
    // Just need to reset the dates array for the next period
    setDates([]);
  }

  return (
    <>
      <ToastContainer />
      <div className='flex flex-col gap-6 py-8'>
        <div className='flex flex-col gap-2'>
          <DynamicBreadcrumbs />
          <h1 className='text-3xl font-bold'>Create Payroll Period</h1>
        </div>
        <Card className='w-full gap-0 p-0'>
          <div className='flex flex-col gap-2 border-b p-6'>
            <CardTitle>Payroll Period Details</CardTitle>
            <CardDescription>
              Create a new payroll period by selecting the start and end dates. You can also set
              holidays for this period.
            </CardDescription>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 p-6'>
            <div className='flex flex-col gap-2'>
              <Label className='text-sm font-semibold'>
                Start Date <span className='text-red-600'>*</span>
              </Label>
              <Input
                type='date'
                className='w-full min-h-8 text-sm border cursor-pointer'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label className='text-sm font-semibold'>
                End Date <span className='text-red-600'>*</span>
              </Label>
              <Input
                type='date'
                className='w-full min-h-8 text-sm border cursor-pointer'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className='lg:col-span-2'>
              <CollapsibleHolidaySelection />
            </div>
          </div>
        </Card>
        <div className='flex flex-col lg:flex-row gap-2'>
          <Button
            className='cursor-pointer'
            onClick={() => handleCreate(startDate, endDate)}
            disabled={!startDate || !endDate}
          >
            Create
          </Button>
          <Button
            className='cursor-pointer'
            onClick={() => handleCreateAndCreateAnother(startDate, endDate)}
            disabled={!startDate || !endDate}
            variant={'outline'}
          >
            Create & create another
          </Button>
          <CustomLink href='/periods' className='cursor-pointer' variant={'outline'}>
            Cancel
          </CustomLink>
        </div>
      </div>
    </>
  );
}
