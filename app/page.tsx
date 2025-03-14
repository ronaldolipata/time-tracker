'use client';

import { useCallback, useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TimeEntry, EmployeeData, Summary } from '@/types/EmployeeData';
import {
  calculateTotalRegularWorkDays,
  calculateTotalSundayWorkDays,
} from '@/helpers/workdayHelper';
import {
  calculateRegularOvertime,
  calculateTotalRegularHolidayOvertime,
  calculateTotalSundayOvertime,
} from '@/helpers/overtimeHelper';
import AttendanceTable from './components/AttendanceTable';
import HolidaySelection from './components/HolidaySelection';
import { Button } from '@/components/ui/button';
import Holidays from '@/types/Holidays';
import { Input } from '@/components/ui/input';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import {
  calculateTotalRegularHoliday,
  calculateTotalSpecialNonWorkingHoliday,
  calculateTotalSpecialWorkingHoliday,
} from '@/helpers/holidayHelper';

export default function Home() {
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

  function notifySuccess() {
    toast.success('Time entries successfully entered!', {
      position: 'top-right',
      autoClose: 3000,
    });
  }

  function handleApplyDates() {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      setDates(getDatesInRange(start, end));
      setShowHolidaySelection(true);
      setIsAttendanceTableVisible(false);
      setIsTimeEntriesEnabled(false);
    }
  }

  function getDatesInRange(start: Date, end: Date): string[] {
    const dates = [];
    let current = start;
    while (current <= end) {
      dates.push(format(current, 'MM/dd/yyyy'));
      current = addDays(current, 1);
    }
    return dates;
  }

  const generateSummary = useCallback((timeEntries: TimeEntry[], holidays: Holidays): Summary => {
    const totalRegularWorkDays = calculateTotalRegularWorkDays(timeEntries, holidays);
    const totalSundayDays = calculateTotalSundayWorkDays(timeEntries, holidays);
    const totalSundayOvertime = calculateTotalSundayOvertime(timeEntries);
    const totalRegularOvertime = calculateRegularOvertime(timeEntries);

    const totalRegularHoliday = calculateTotalRegularHoliday(timeEntries, holidays);
    const totalRegularHolidayOvertime = calculateTotalRegularHolidayOvertime(timeEntries, holidays);
    const totalSpecialNonWorkingHoliday = calculateTotalSpecialNonWorkingHoliday(
      timeEntries,
      holidays
    );
    const totalSpecialWorkingHoliday = calculateTotalSpecialWorkingHoliday(timeEntries, holidays);

    return {
      totalRegularWorkDays,
      totalSundayDays,
      totalSundayOvertime,
      totalRegularOvertime,
      totalRegularHoliday,
      totalRegularHolidayOvertime,
      totalSpecialNonWorkingHoliday,
      totalSpecialWorkingHoliday,
    };
  }, []);

  function processPastedData(pastedText: string): EmployeeData[] {
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
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    if (!startDate || !endDate) {
      toast.error('Please select a date range before pasting data.');
      return [];
    }

    if (!isTimeEntriesEnabled)
      return toast.error('Please select the holidays first before proceeding.');

    const pastedText = event.clipboardData.getData('Text');
    const newEmployeeData = processPastedData(pastedText);
    setEmployeeData(newEmployeeData);
    setIsAttendanceTableVisible(true);
    notifySuccess();
  }

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
          totalSpecialNonWorkingHoliday,
          totalSpecialWorkingHoliday,
        } = generateSummary(timeEntries, holidays);

        return `${formatValue(totalRegularWorkDays)}\t${formatValue(
          totalSundayDays
        )}\t${formatValue(totalSundayOvertime)}\t${formatValue(
          totalRegularOvertime
        )}\t${formatValue(totalRegularHoliday)}\t${formatValue(
          totalRegularHolidayOvertime
        )}\t\t\t${formatValue(totalSpecialNonWorkingHoliday)}\t${formatValue(
          totalSpecialWorkingHoliday
        )}`;
      })
      .join('\n');

    navigator.clipboard.writeText(data);
    toast.success('Copied to clipboard!');
  }, [employeeData, generateSummary, holidays]);

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
          <Card className='w-full lg:w-auto gap-4 p-4'>
            <CardTitle>Payroll Period</CardTitle>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex flex-col gap-2'>
                <label className='text-sm'>Start Date:</label>
                <Input
                  className='flex justify-center'
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='text-sm'>End Date:</label>
                <Input
                  className='flex justify-center'
                  type='date'
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <Button
                className='md:self-end focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'
                onClick={handleApplyDates}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyDates();
                  }
                }}
              >
                Apply
              </Button>
            </div>
          </Card>

          <Card className='min-w-[189px] gap-4 grow-1 p-4'>
            <div className='flex flex-col gap-2'>
              <CardTitle>Time Entries</CardTitle>
              <CardDescription>e.g. DOE, JOHN 8:00 AM 5:00 PM</CardDescription>
            </div>
            <Input
              type='text'
              className={`w-full min-h-8 border p-2 placeholder:text-sm ${
                isTimeEntriesEnabled ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              placeholder='Paste the time in, and time out data here...'
              onPaste={handlePaste}
              disabled={isTimeEntriesEnabled ? false : true}
            />
          </Card>

          <Card className='w-full md:max-w-[12rem] flex-col gap-4 p-4 text-center'>
            <div className='flex flex-col gap-2'>
              <CardTitle>Data</CardTitle>
              <CardDescription>Press CTRL + C to copy</CardDescription>
            </div>
            <Button
              className={`mt-auto focus:bg-blue-900 hover:bg-blue-900 ${
                isAttendanceTableVisible ? 'cursor-pointer' : 'cursor-not-allowed'
              }`}
              onClick={handleCopy}
              variant={isAttendanceTableVisible ? 'default' : 'ghost'}
              disabled={isAttendanceTableVisible ? false : true}
            >
              Copy data
            </Button>
          </Card>
        </div>

        <Card className='gap-4 p-4'>
          <div className='flex flex-col gap-2'>
            <CardTitle>Holiday Instructions</CardTitle>
            <CardDescription>
              Holiday numbers represent pay types and are added up to get the total holiday pay.
            </CardDescription>
          </div>
          <div className='flex flex-col md:flex-row gap-4'>
            <Card className='md:flex-1 gap-2 p-4 text-sm text-gray-600'>
              <p className='font-semibold'>Regular Holiday</p>
              <p>1 → Paid (Worked before & after but did not work on the holiday)</p>
              <p>2 → Double Pay (Worked on the holiday itself)</p>
            </Card>
            <Card className='md:flex-1 gap-2 p-4 text-sm text-gray-600'>
              <p className='font-semibold'>Special Non-Working Holiday</p>
              <p>1 → 130% Pay (Worked on the holiday itself)</p>
            </Card>
            <Card className='md:flex-1 gap-2 p-4 text-sm text-gray-600'>
              <p className='font-semibold'>Special Working Holiday</p>
              <p>1 → Regular Pay (Worked on the holiday itself, no premium)</p>
            </Card>
          </div>
        </Card>

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
}
