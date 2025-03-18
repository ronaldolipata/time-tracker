import { Card } from '@/components/ui/card';
import addEllipsis from '@/helpers/addEllipsis';
import AttendanceTableDialog from './AttendanceTableDialog';
import { EmployeeData, Summary } from '@/context/types';
import { useTimeTracker } from '@/context/TimeTrackerContext';

export default function AttendanceTable() {
  const { holidays, employeeData } = useTimeTracker();

  const convertTitleCase = (title: string): string => {
    return title
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  };

  return (
    <div className='flex flex-wrap gap-4'>
      {employeeData.map(({ name, timeEntries, summary }: EmployeeData) => (
        <Card key={name} className='w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(100%/3-0.7rem)] p-4'>
          <p className='text-lg font-bold text-center text-blue-900'>{addEllipsis(20, name)}</p>
          {/* Two-column layout for summary items */}
          <div className='grid grid-cols-2 gap-2 w-full text-center'>
            {Object.keys(summary).map((key) => {
              // Determine the suffix based on key name
              const suffix = /hours|overtime/i.test(key) ? 'H' : /days/i.test(key) ? 'D' : '';

              return (
                <p key={key} className='p-4 odd:bg-sky-100 even:bg-gray-100 rounded-xl'>
                  {convertTitleCase(key)}
                  <span className='block font-bold'>
                    {summary[key as keyof Summary] !== 0
                      ? summary[key as keyof Summary] + suffix
                      : '-'}
                  </span>
                </p>
              );
            })}
          </div>
          <AttendanceTableDialog holidays={holidays} name={name} timeEntries={timeEntries} />
        </Card>
      ))}
    </div>
  );
}
