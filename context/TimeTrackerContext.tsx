'use client';

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { EmployeeData, Holidays, TimeEntry } from './types';
import { toast } from 'react-toastify';
import { addDays, format } from 'date-fns';
import { calculateSummary } from '@/helpers/calculateSummary';

type TimeTrackerType = {
  startDate: string;
  endDate: string;
  setStartDate: Dispatch<SetStateAction<string>>;
  setEndDate: Dispatch<SetStateAction<string>>;
  dates: string[];
  holidays: Holidays;
  showHolidaySelection: boolean;
  isAttendanceTableVisible: boolean;
  isTimeEntriesEnabled: boolean;
  setIsTimeEntriesEnabled: Dispatch<SetStateAction<boolean>>;
  setShowHolidaySelection: Dispatch<SetStateAction<boolean>>;
  setHolidays: Dispatch<SetStateAction<Holidays>>;
  handleApplyDates: () => void;
  handlePaste: (
    event: React.ClipboardEvent<HTMLInputElement>
  ) => string | number | never[] | undefined;
  handleCopy: () => void;
  employeeData: EmployeeData[];
};

const TimeTrackerContext = createContext<TimeTrackerType | undefined>(undefined);

export const TimeTrackerProvider = ({ children }: { children: ReactNode }) => {
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

  function handleApplyDates(): void {
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

        return { name, timeEntries, summary: calculateSummary(timeEntries, holidays) };
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
      .map(({ summary }) => {
        const {
          totalRegularWorkDays,
          totalSundayDays,
          totalSundayOvertime,
          totalRegularOvertime,
          totalRegularHoliday,
          totalRegularHolidayOvertime,
          totalSpecialNonWorkingHoliday,
          totalSpecialWorkingHoliday,
        } = summary;

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
  }, [employeeData]);

  return (
    <TimeTrackerContext.Provider
      value={{
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        dates,
        holidays,
        showHolidaySelection,
        isAttendanceTableVisible,
        isTimeEntriesEnabled,
        setIsTimeEntriesEnabled,
        setShowHolidaySelection,
        setHolidays,
        handleApplyDates,
        handlePaste,
        handleCopy,
        employeeData,
      }}
    >
      {children}
    </TimeTrackerContext.Provider>
  );
};

export const useTimeTracker = () => {
  const context = useContext(TimeTrackerContext);
  if (!context) throw new Error('useTimeTracker must be used within an TimeTrackerProvider');
  return context;
};
