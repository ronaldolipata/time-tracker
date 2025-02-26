import React from 'react';
import AttendanceTracker from './components/AttendanceTracker';

const App: React.FC = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-grow'>
        <div className='2xl:w-[100rem] lg:mx-auto'>
          <div className='w-full px-5 md:px-8 mx-auto'>
            <AttendanceTracker />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
