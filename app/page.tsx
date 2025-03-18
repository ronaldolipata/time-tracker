'use client';

import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AttendanceTable from './components/AttendanceTable';
import HolidaySelection from './components/HolidaySelection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { useTimeTracker } from '@/context/TimeTrackerContext';

export default function Home() {
  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    showHolidaySelection,
    isAttendanceTableVisible,
    isTimeEntriesEnabled,
    handleApplyDates,
    handlePaste,
    handleCopy,
  } = useTimeTracker();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey && event.key === 'c') {
        event.preventDefault();
        handleCopy();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleCopy]);

  return (
    <>
      <ToastContainer />

      <div className='flex flex-col gap-4 py-4'>
        <h1 className='text-xl font-bold'>Time Tracker</h1>

        <div className='flex flex-wrap gap-4'>
          <Card className='w-full lg:w-auto gap-4 p-4'>
            <CardTitle>Payroll Period</CardTitle>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm'>Start Date:</label>
                <Input
                  className='flex justify-center'
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm'>End Date:</label>
                <Input
                  className='flex justify-center'
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Button
                className='md:self-end focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'
                onClick={handleApplyDates}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyDates();
                  }
                }}
              >
                Apply
              </Button>
            </div>
          </Card>

          <Card className='min-w-[189px] gap-4 grow-1 p-4'>
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
        </div>

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

        {isAttendanceTableVisible && <AttendanceTable />}
        {showHolidaySelection && <HolidaySelection />}
      </div>
    </>
  );
}
