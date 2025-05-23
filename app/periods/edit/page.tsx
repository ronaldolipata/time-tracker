'use client';

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTimeTracker } from '@/context/time-tracker-context';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CollapsibleHolidaySelection from '../components/collapsible-holiday-selection';
import UpdatePeriodDialog from './components/update-period-dialog';
import { CustomLink } from '@/components/custom-link';
import { DynamicBreadcrumbs } from '@/components/dynamic-breadcrumbs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Holidays } from '@/context/types';
import { SuspenseWrapper } from '@/components/suspense-wrapper';
import { ErrorBoundary } from '@/components/error-boundary';

function EditContent() {
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    setPayrollPeriod,
    setHolidays,
    payrollPeriod,
  } = useTimeTracker();
  const router = useRouter();
  const searchParams = useSearchParams();
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  const [datesChanged, setDatesChanged] = useState(false);
  const [tempHolidays, setTempHolidays] = useState<Holidays>({
    regular: { dates: new Set<string>() },
    specialNonWorkingHoliday: { dates: new Set<string>() },
    specialWorkingHoliday: { dates: new Set<string>() },
  });

  useEffect(() => {
    if (start && end) {
      setStartDate(new Date(start).toISOString().split('T')[0]);
      setEndDate(new Date(end).toISOString().split('T')[0]);

      // Find the period to edit and initialize its holidays
      const periodToEdit = payrollPeriod.find(
        (period) => period.startDate.toISOString() === start && period.endDate.toISOString() === end
      );

      if (periodToEdit) {
        const initialHolidays: Holidays = {
          regular: { dates: new Set<string>(periodToEdit.holidays.regular) },
          specialNonWorkingHoliday: {
            dates: new Set<string>(periodToEdit.holidays.specialNonWorkingHoliday),
          },
          specialWorkingHoliday: {
            dates: new Set<string>(periodToEdit.holidays.specialWorkingHoliday),
          },
        };
        setHolidays(initialHolidays);
        setTempHolidays(initialHolidays);
      }
    }
  }, [start, end, setStartDate, setEndDate, setHolidays, payrollPeriod]);

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
              regular: new Set<string>(tempHolidays.regular.dates),
              specialNonWorkingHoliday: new Set<string>(
                tempHolidays.specialNonWorkingHoliday.dates
              ),
              specialWorkingHoliday: new Set<string>(tempHolidays.specialWorkingHoliday.dates),
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
    // Clear holidays in the context and temp state when dates change
    const emptyHolidays: Holidays = {
      regular: { dates: new Set<string>() },
      specialNonWorkingHoliday: { dates: new Set<string>() },
      specialWorkingHoliday: { dates: new Set<string>() },
    };
    setHolidays(emptyHolidays);
    setTempHolidays(emptyHolidays);
  };

  return (
    <>
      <ToastContainer />
      <div className='flex flex-col gap-5 py-8'>
        <div className='flex flex-col gap-2'>
          <DynamicBreadcrumbs />
          <h1 className='text-3xl font-bold'>Edit Payroll Period</h1>
        </div>
        <Card className='w-full gap-0 p-0'>
          <div className='flex flex-col gap-2 border-b p-5'>
            <CardTitle>Payroll Period Details</CardTitle>
            <CardDescription>
              Edit the payroll period by updating the start and end dates. You can also modify the
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
          </div>
          <CollapsibleHolidaySelection
            isEditMode={true}
            datesChanged={datesChanged}
            tempHolidays={tempHolidays}
            setTempHolidays={setTempHolidays}
          />
        </Card>
        <div className='flex flex-col lg:flex-row gap-2'>
          <UpdatePeriodDialog
            startDate={startDate}
            endDate={endDate}
            onUpdate={handleUpdate}
            disabled={!startDate || !endDate}
          />
          <CustomLink href='/periods' className='cursor-pointer' variant={'outline'}>
            Cancel
          </CustomLink>
        </div>
      </div>
    </>
  );
}

export default function Edit() {
  return (
    <ErrorBoundary>
      <SuspenseWrapper>
        <EditContent />
      </SuspenseWrapper>
    </ErrorBoundary>
  );
}
