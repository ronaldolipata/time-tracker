'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PayrollPeriod from './components/select-payroll-period';
import SelectProject from './components/select-project';
import TimeEntries from './components/time-entries';
import ProjectsData from './components/projects-data';

export default function Home() {
  return (
    <>
      <ToastContainer />
      <div className='grid gap-5'>
        <div className='grid gap-5'>
          <h1 className='text-xl font-bold'>Time Tracker</h1>
          <div className='grid grid-cols-1 xl:grid-cols-4 gap-y-5 xl:gap-5'>
            <PayrollPeriod />
            <SelectProject />
            <TimeEntries />
          </div>
        </div>
        <ProjectsData />
      </div>
    </>
  );
}
