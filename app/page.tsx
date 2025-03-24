'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SelectProject from './components/select-project';
import PayrollPeriod from './components/payroll-period';
import TimeEntries from './components/time-entries';
import ProjectsData from './components/projects-data';

export default function Home() {
  return (
    <>
      <ToastContainer />
      <div className='flex flex-col gap-4 py-4'>
        <h1 className='text-xl font-bold'>Time Tracker</h1>
        <SelectProject />
        <div className='flex flex-col lg:flex-row gap-4'>
          <PayrollPeriod />
          <TimeEntries />
        </div>
      </div>
      <ProjectsData />
    </>
  );
}
