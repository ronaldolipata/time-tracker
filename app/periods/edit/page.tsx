'use client';

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTimeTracker } from '@/context/time-tracker-context';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HolidaySelectionDialog from '../components/holiday-selection-dialog';
import { Button } from '@/components/ui/button';
import { CustomLink } from '@/components/custom-link';
import { DynamicBreadcrumbs } from '@/components/dynamic-breadcrumbs';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Edit() {
  const { startDate, endDate, setStartDate, setEndDate, setPayrollPeriod, setHolidays, holidays } =
    useTimeTracker();
  const router = useRouter();
  const searchParams = useSearchParams();
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const [datesChanged, setDatesChanged] = useState(false);

  useEffect(() => {
    if (start && end) {
      setStartDate(new Date(start).toISOString().split('T')[0]);
      setEndDate(new Date(end).toISOString().split('T')[0]);
    }
  }, [start, end, setStartDate, setEndDate]);

  function handleUpdate(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      toast.error('End date cannot be before start date');
      return;
    }

    const oldStart = searchParams.get('start');
    const oldEnd = searchParams.get('end');

    if (!oldStart || !oldEnd) {
      toast.error('Invalid period data');
      return;
    }

    // Update the period
    setPayrollPeriod((prev) =>
      prev.map((period) => {
        if (
          period.startDate.toISOString() === oldStart &&
          period.endDate.toISOString() === oldEnd
        ) {
          return {
            ...period,
            startDate: start,
            endDate: end,
            holidays: {
              regular: new Set(holidays.regular.dates),
              specialNonWorkingHoliday: new Set(holidays.specialNonWorkingHoliday.dates),
              specialWorkingHoliday: new Set(holidays.specialWorkingHoliday.dates),
            },
          };
        }
        return period;
      })
    );

    toast.success('Payroll period updated successfully');
    router.push('/periods');
  }

  const handleDateChange = (date: string, setter: (date: string) => void) => {
    setter(date);
    setDatesChanged(true);
    // Clear holidays in the context when dates change
    setHolidays({
      regular: { dates: new Set() },
      specialNonWorkingHoliday: { dates: new Set() },
      specialWorkingHoliday: { dates: new Set() },
    });
  };

  return (
    <>
      <ToastContainer />
      <div className='flex flex-col gap-6 py-8'>
        <div className='flex flex-col gap-2'>
          <DynamicBreadcrumbs />
          <h1 className='text-3xl font-bold'>Edit Payroll Period</h1>
        </div>
        <Card className='w-full gap-0 p-0'>
          <div className='flex flex-col gap-2 border-b p-6'>
            <CardTitle>Payroll Period Details</CardTitle>
            <CardDescription>
              Edit the payroll period by updating the start and end dates. You can also modify the
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
                onChange={(e) => handleDateChange(e.target.value, setStartDate)}
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
                onChange={(e) => handleDateChange(e.target.value, setEndDate)}
              />
            </div>
            <div className='lg:col-span-2'>
              <HolidaySelectionDialog isEditMode={true} datesChanged={datesChanged} />
            </div>
          </div>
        </Card>
        <div className='flex flex-col lg:flex-row gap-2'>
          <Button
            className='cursor-pointer'
            onClick={() => handleUpdate(startDate, endDate)}
            disabled={!startDate || !endDate}
          >
            Update
          </Button>
          <CustomLink href='/periods' className='cursor-pointer' variant={'outline'}>
            Cancel
          </CustomLink>
        </div>
      </div>
    </>
  );
}
