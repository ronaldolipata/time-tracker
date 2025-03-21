'use client';

import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AttendanceTable from './components/AttendanceTable';
import { useTimeTracker } from '@/context/TimeTrackerContext';
import ProjectDetails from './components/ProjectDetails';
import SelectProject from './components/SelectProject';
import PayrollPeriod from './components/PayrollPeriod';
import TimeEntries from './components/TimeEntries';
import ProjectsData from './components/ProjectsData';

export default function Home() {
  const { isAttendanceTableVisible, handleCopy } = useTimeTracker();

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
        <div className='flex flex-col lg:flex-row gap-4'>
          <ProjectDetails />
          <SelectProject />
        </div>
        <div className='flex flex-col lg:flex-row gap-4'>
          <PayrollPeriod />
          <TimeEntries />
        </div>
      </div>
      <ProjectsData />
      {/* {isAttendanceTableVisible && <AttendanceTable />} */}
    </>
  );
}
