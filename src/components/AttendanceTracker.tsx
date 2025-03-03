import { useCallback, useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TimeEntry, EmployeeData, Summary } from '../types/EmployeeData';
import {
  calculateTotalRegularWorkDays,
  calculateTotalSundayWorkDays,
} from '@/helpers/workdayHelper';
import {
  calculateRegularOvertime,
  calculateTotalRegularHolidayOvertime,
  calculateTotalSundayOvertime,
} from '@/helpers/overtimeHelper';
import AttendanceTable from './AttendanceTable';
import HolidaySelection from './HolidaySelection';
import { Button } from '@/components/ui/button';
import Holidays from '@/types/Holidays';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { calculateTotalRegularHoliday } from '@/helpers/holidayHelper';

const AttendanceTracker = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [dates, setDates] = useState<string[]>([]);
  const [showHolidaySelection, setShowHolidaySelection] = useState<boolean>(false);
  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);
  const [isTimeEntriesEnabled, setIsTimeEntriesEnabled] = useState<boolean>(false);
  const [isAttendanceTableVisible, setIsAttendanceTableVisible] = useState<boolean>(false);

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
      setIsAttendanceTableVisible(false);
      setIsTimeEntriesEnabled(false);
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

  const generateSummary = useCallback((timeEntries: TimeEntry[], holidays: Holidays): Summary => {
    const totalRegularWorkDays = calculateTotalRegularWorkDays(timeEntries);
    const totalSundayDays = calculateTotalSundayWorkDays(timeEntries);
    const totalSundayOvertime = calculateTotalSundayOvertime(timeEntries);
    const totalRegularOvertime = calculateRegularOvertime(timeEntries);

    const totalRegularHoliday = calculateTotalRegularHoliday(timeEntries, holidays);
    const totalRegularHolidayOvertime = calculateTotalRegularHolidayOvertime(timeEntries, holidays);

    return {
      totalRegularWorkDays,
      totalSundayDays,
      totalSundayOvertime,
      totalRegularOvertime,
      totalRegularHoliday,
      totalRegularHolidayOvertime,
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

        return { name, timeEntries, summary: generateSummary(timeEntries, holidays) };
      });
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('Text');
    const newEmployeeData = processPastedData(pastedText);
    setEmployeeData(newEmployeeData);
    setIsAttendanceTableVisible(true);
    notifySuccess();
  };

  const formatValue = (value: number) => (value > 0 ? value.toFixed(2).replace(/\.00$/, '') : '');

  const handleCopy = useCallback(() => {
    const data = employeeData
      .map(({ timeEntries }) => {
        const {
          totalRegularWorkDays,
          totalSundayDays,
          totalSundayOvertime,
          totalRegularOvertime,
          totalRegularHoliday,
          totalRegularHolidayOvertime,
        } = generateSummary(timeEntries, holidays);
        return `${totalRegularWorkDays || ''}\t${totalSundayDays || ''}\t${formatValue(
          totalSundayOvertime
        )}\t${formatValue(totalRegularOvertime)}\t${totalRegularHoliday || ''}\t${
          totalRegularHolidayOvertime || ''
        }`;
      })
      .join('\n');

    navigator.clipboard.writeText(data);
    toast.success('Copied to clipboard!');
  }, [employeeData, generateSummary, holidays]);

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

      <div className='flex flex-col gap-4 py-4'>
        <h2 className='text-xl font-bold'>Time Tracker</h2>

        <div className='flex flex-wrap gap-4'>
          <Card className='w-full lg:w-auto flex flex-col md:flex-row flex-wrap gap-4 md:items-end md:justify-center lg:justify-start self-start p-4 text-center lg:text-left'>
            <div className='flex flex-col gap-2'>
              <label>Start Date:</label>
              <Input
                className='flex justify-center'
                type='date'
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label>End Date:</label>
              <Input
                className='flex justify-center'
                type='date'
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button
              className='focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'
              onClick={handleApplyDates}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApplyDates();
                }
              }}
            >
              Apply
            </Button>
          </Card>

          <Card className='min-w-[189px] gap-2 grow-1 p-4'>
            <h2>Time Entries</h2>
            <Input
              type='text'
              className={`min-h-8 border p-2 w-full ${
                isTimeEntriesEnabled ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              placeholder='Paste time in, and time out data here...'
              onPaste={handlePaste}
              disabled={isTimeEntriesEnabled ? false : true}
            />
          </Card>

          <Card className='min-w-[189px] flex-col gap-2 self-end grow-1 md:grow-0 p-4 text-center'>
            <p>Press CTRL + C to copy</p>
            <Button
              className={`focus:bg-blue-900 hover:bg-blue-900 ${
                isAttendanceTableVisible ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              onClick={handleCopy}
              variant={isAttendanceTableVisible ? 'default' : 'ghost'}
              disabled={isAttendanceTableVisible ? false : true}
            >
              Copy Data
            </Button>
          </Card>
        </div>

        {isAttendanceTableVisible && (
          <AttendanceTable holidays={holidays} employeeData={employeeData} />
        )}

        {showHolidaySelection && (
          <HolidaySelection
            holidays={holidays}
            setHolidays={setHolidays}
            dates={dates}
            setIsTimeEntriesEnabled={setIsTimeEntriesEnabled}
            setShowHolidaySelection={setShowHolidaySelection}
          />
        )}
      </div>
    </>
  );
};

export default AttendanceTracker;
