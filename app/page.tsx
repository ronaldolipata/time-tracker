'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProjectDetails from './components/ProjectDetails';
import SelectProject from './components/SelectProject';
import PayrollPeriod from './components/PayrollPeriod';
import TimeEntries from './components/TimeEntries';
import ProjectsData from './components/ProjectsData';

export default function Home() {
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
    </>
  );
}
