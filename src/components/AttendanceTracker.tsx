import { useCallback, useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TimeEntry, EmployeeData, Summary } from '../types/EmployeeData';
import {
  calculateTotalRegularWorkDays,
  calculateTotalSundayWorkDays,
} from '@/helpers/workdayHelper';
import { calculateRegularOvertime, calculateTotalSundayOvertime } from '@/helpers/overtimeHelper';
import AttendanceTable from './AttendanceTable';
import HolidaySelection from './HolidaySelection';
import { Button } from '@/components/ui/button';
import Holidays from '@/types/Holidays';
import { Input } from './ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from './ui/card';

const AttendanceTracker = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dates, setDates] = useState<string[]>([]);
  const [showHolidaySelection, setShowHolidaySelection] = useState(false);

  const [showTimeEntries, setShowTimeEntries] = useState(false);
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [showAttendanceTables, setAttendanceShowTables] = useState(false);

  const [holidays, setHolidays] = useState<Holidays>({
    regular: { dates: new Set() },
    specialNonWorkingHoliday: { dates: new Set() },
    specialWorkingHoliday: { dates: new Set() },
  });

  const notifySuccess = () => {
    toast.success('Time entries successfully entered!', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const handleApplyDates = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      setDates(getDatesInRange(start, end));
      setShowHolidaySelection(true);
      setAttendanceShowTables(false);
      setShowTimeEntries(false);
    }
  };

  const getDatesInRange = (start: Date, end: Date): string[] => {
    const dates = [];
    let current = start;
    while (current <= end) {
      dates.push(format(current, 'MM/dd/yyyy'));
      current = addDays(current, 1);
    }
    return dates;
  };

  const generateSummary = useCallback((timeEntries: TimeEntry[]): Summary => {
    const totalRegularWorkDays = calculateTotalRegularWorkDays(timeEntries);
    const totalSundayDays = calculateTotalSundayWorkDays(timeEntries);
    const totalSundayOvertime = calculateTotalSundayOvertime(timeEntries);
    const totalRegularOvertime = calculateRegularOvertime(timeEntries);

    return {
      totalRegularWorkDays,
      totalSundayDays,
      totalSundayOvertime,
      totalRegularOvertime,
    };
  }, []);

  const processPastedData = (pastedText: string): EmployeeData[] => {
    if (!startDate || !endDate) {
      toast.error('Please select a date range before pasting data.');
      return [];
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates = getDatesInRange(start, end);

    return pastedText
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => {
        const [name, ...times] = line.split(/\t|\s{2,}/);
        const timeEntries: TimeEntry[] = dates.map((date, index) => ({
          date,
          timeIn: times[index * 2] || '',
          timeOut: times[index * 2 + 1] || '',
        }));

        return { name, timeEntries, summary: generateSummary(timeEntries) };
      });
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('Text');
    const newEmployeeData = processPastedData(pastedText);
    setEmployeeData(newEmployeeData);
    setAttendanceShowTables(true);
    notifySuccess();
  };

  const formatValue = (value: number) => (value > 0 ? value.toFixed(2).replace(/\.00$/, '') : '');

  const handleCopy = useCallback(() => {
    const data = employeeData
      .map(({ timeEntries }) => {
        const { totalRegularWorkDays, totalSundayDays, totalSundayOvertime, totalRegularOvertime } =
          generateSummary(timeEntries);
        return `${totalRegularWorkDays || ''}\t${totalSundayDays || ''}\t${formatValue(
          totalSundayOvertime
        )}\t${formatValue(totalRegularOvertime)}`;
      })
      .join('\n');

    navigator.clipboard.writeText(data);
    toast.success('Copied to clipboard!');
  }, [employeeData, generateSummary]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'c') {
        event.preventDefault();
        handleCopy();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleCopy]);

  return (
    <>
      <ToastContainer />

      <div className='flex flex-col gap-4 p-4'>
        <h2 className='text-xl font-bold'>Time Tracker</h2>

        <div className='flex gap-4'>
          <Card className='flex flex-row gap-4 items-center self-start px-4'>
            <div>
              <label className='block mb-2'>Start Date:</label>
              <Input
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className='min-h-8 border p-2'
              />
            </div>
            <div>
              <label className='block mb-2'>End Date:</label>
              <Input
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className='min-h-8 border p-2'
              />
            </div>
            <Button className='self-end' onClick={handleApplyDates}>
              Apply
            </Button>
          </Card>

          {showTimeEntries && (
            <Card className='gap-0 grow-1 px-4'>
              <h2 className='mb-2'>Time Entries</h2>
              <Textarea
                className='min-h-8 border p-2 w-full'
                placeholder='Paste time in, and time out data here...'
                onPaste={handlePaste}
              />
            </Card>
          )}

          {showAttendanceTables && (
            <Card className='gap-1 self-end px-4 text-center'>
              <p>Press CTRL + C to copy</p>
              <Button onClick={handleCopy}>Copy Data</Button>
            </Card>
          )}
        </div>

        {showAttendanceTables && <AttendanceTable employeeData={employeeData} />}

        {showHolidaySelection && (
          <HolidaySelection
            holidays={holidays}
            setHolidays={setHolidays}
            dates={dates}
            setShowTimeEntries={setShowTimeEntries}
            setShowHolidaySelection={setShowHolidaySelection}
          />
        )}
      </div>
    </>
  );
};

export default AttendanceTracker;
