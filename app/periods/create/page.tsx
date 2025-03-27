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
import { useState } from 'react';
import { Holidays } from '@/context/types';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { ErrorBoundary } from '@/components/error-boundary';

function CreateContent() {
  const { startDate, endDate, setStartDate, setEndDate, handleCreatePayrollPeriod, setHolidays } =
    useTimeTracker();
  const router = useRouter();
  const [tempHolidays, setTempHolidays] = useState<Holidays>({
    regular: { dates: new Set() },
    specialNonWorkingHoliday: { dates: new Set() },
    specialWorkingHoliday: { dates: new Set() },
  });
  const [isHolidaySelectionExpanded, setIsHolidaySelectionExpanded] = useState(false);

  function handleCreate(startDate: string, endDate: string) {
    setHolidays(tempHolidays);
    handleCreatePayrollPeriod(new Date(startDate), new Date(endDate), tempHolidays);
    handleClearTempHolidays();
    router.push(`/periods?success=${encodeURIComponent('Successfully created')}`);
  }

  function handleCreateAndCreateAnother(startDate: string, endDate: string) {
    setHolidays(tempHolidays);
    handleCreatePayrollPeriod(new Date(startDate), new Date(endDate), tempHolidays);
    handleClearTempHolidays();
    setIsHolidaySelectionExpanded(false);
  }

  function handleClearTempHolidays() {
    setTempHolidays({
      regular: { dates: new Set() },
      specialNonWorkingHoliday: { dates: new Set() },
      specialWorkingHoliday: { dates: new Set() },
    });
  }

  return (
    <>
      <ToastContainer />
      <div className='flex flex-col gap-5 py-8'>
        <div className='flex flex-col gap-2'>
          <DynamicBreadcrumbs />
          <h1 className='text-3xl font-bold'>Create Payroll Period</h1>
        </div>
        <Card className='w-full gap-0 p-0'>
          <div className='flex flex-col gap-2 border-b p-5'>
            <CardTitle>Payroll Period Details</CardTitle>
            <CardDescription>
              Create a new payroll period by selecting the start and end dates. You can also set
              holidays for this period.
            </CardDescription>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 p-5'>
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
          </div>
          <CollapsibleHolidaySelection
            tempHolidays={tempHolidays}
            setTempHolidays={setTempHolidays}
            isExpanded={isHolidaySelectionExpanded}
            onExpandedChange={setIsHolidaySelectionExpanded}
          />
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

export default function Create() {
  return (
    <ErrorBoundary>
      <SuspenseWrapper>
        <CreateContent />
      </SuspenseWrapper>
    </ErrorBoundary>
  );
}
