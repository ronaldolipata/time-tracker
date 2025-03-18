'use client';

import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AttendanceTable from './components/AttendanceTable';
import HolidaySelection from './components/HolidaySelection';
import { useTimeTracker } from '@/context/TimeTrackerContext';
import Location from './components/Location';
import PayrollPeriod from './components/PayrollPeriod';
import TimeEntries from './components/TimeEntries';

export default function Home() {
  const { isHolidaySelectionVisible, isAttendanceTableVisible, handleCopy } = useTimeTracker();

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
          <Location />
          <PayrollPeriod />
          <TimeEntries />
        </div>
        {isAttendanceTableVisible && <AttendanceTable />}
        {isHolidaySelectionVisible && <HolidaySelection />}
      </div>
    </>
  );
}
