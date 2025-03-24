'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PayrollPeriod from './components/payroll-period';
import SelectProject from './components/select-project';
import TimeEntries from './components/time-entries';
import ProjectsData from './components/projects-data';

export default function Home() {
  return (
    <>
      <ToastContainer />
      <div className='flex flex-col gap-4 py-4'>
        <h1 className='text-xl font-bold'>Time Tracker</h1>
        {/* @TODO: Select payroll period */}
        <PayrollPeriod />
        <div className='flex flex-col lg:flex-row gap-4'>
          <SelectProject />
          <TimeEntries />
        </div>
      </div>
      <ProjectsData />
    </>
  );
}
