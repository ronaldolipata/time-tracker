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
import { EmployeeData, Holidays, ProjectData, TimeEntry } from './types';
import { toast } from 'react-toastify';
import { addDays, format } from 'date-fns';
import { calculateSummary } from '@/helpers/calculateSummary';

type TimeTrackerType = {
  // Project Details
  projectLocation: string;
  projectStatus: string;
  projectName: string;
  setProjectLocation: Dispatch<SetStateAction<string>>;
  setProjectName: Dispatch<SetStateAction<string>>;
  setProjectStatus: Dispatch<SetStateAction<string>>;
  setProjectData: Dispatch<SetStateAction<ProjectData>>;

  // Selected Project Location, Name
  selectedLocation: string;
  selectedProject: string;
  setSelectedLocation: Dispatch<SetStateAction<string>>;
  setSelectedProject: Dispatch<SetStateAction<string>>;

  // Payroll Period
  startDate: string;
  endDate: string;
  setStartDate: Dispatch<SetStateAction<string>>;
  setEndDate: Dispatch<SetStateAction<string>>;

  // Holidays
  dates: string[];
  holidays: Holidays;
  setHolidays: Dispatch<SetStateAction<Holidays>>;

  // UI
  isHolidaySelectionVisible: boolean;
  isAttendanceTableVisible: boolean;
  isTimeEntriesEnabled: boolean;
  isPayrollPeriodEnabled: boolean;
  setIsTimeEntriesEnabled: Dispatch<SetStateAction<boolean>>;
  setIsHolidaySelectionVisible: Dispatch<SetStateAction<boolean>>;
  setIsPayrollPeriodEnabled: Dispatch<SetStateAction<boolean>>;

  // Functions
  handleCreateProject: (
    projectLocation: string,
    projectName: string,
    projectStatus: string
  ) => boolean;
  handleClearProjectDetails: () => void;
  handleApplyDates: (startDate: string, endDate: string) => void;
  handlePaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  handleCopy: (projectLocation: string, projectName: string) => void;

  projectData: ProjectData;
  employeeData: EmployeeData[];
};

const TimeTrackerContext = createContext<TimeTrackerType | undefined>(undefined);

export const TimeTrackerProvider = ({ children }: { children: ReactNode }) => {
  // Project Details
  const [projectLocation, setProjectLocation] = useState<string>('');
  const [projectStatus, setProjectStatus] = useState<string>('enabled');
  const [projectName, setProjectName] = useState<string>('');

  // Track selected projectLocation and project
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');

  const [projectData, setProjectData] = useState<ProjectData>([]);

  // Payroll Period
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Holidays
  const [dates, setDates] = useState<string[]>([]);
  const [holidays, setHolidays] = useState<Holidays>({
    regular: { dates: new Set() },
    specialNonWorkingHoliday: { dates: new Set() },
    specialWorkingHoliday: { dates: new Set() },
  });

  // UI
  const [isPayrollPeriodEnabled, setIsPayrollPeriodEnabled] = useState<boolean>(false);
  const [isHolidaySelectionVisible, setIsHolidaySelectionVisible] = useState<boolean>(false);
  const [isTimeEntriesEnabled, setIsTimeEntriesEnabled] = useState<boolean>(false);
  const [isAttendanceTableVisible, setIsAttendanceTableVisible] = useState<boolean>(false);

  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);

  function notifySuccess() {
    toast.success('Time entries successfully entered!', {
      position: 'top-right',
      autoClose: 3000,
    });
  }

  function handleCreateProject(
    projectLocation: string,
    projectName: string,
    projectStatus: string
  ): boolean {
    if (!projectLocation || !projectName || !projectStatus) {
      toast.error('Please enter project location, status, and name');
      return false;
    }

    let isProjectAdded = false; // Track if a project was actually added

    setProjectData((prev) => {
      const existingLocationIndex = prev.findIndex(
        (data) => data.projectLocation.toLowerCase() === projectLocation.toLowerCase()
      );

      if (existingLocationIndex !== -1) {
        const existingLocation = prev[existingLocationIndex];

        const existingProject = existingLocation.projects.find(
          (project) => project.projectName.toLowerCase() === projectName.toLowerCase()
        );

        if (existingProject) {
          toast.error('Project name already exists for this project location');
          return prev; // No changes, return existing state
        }

        // Add new project to existing projectLocation
        const updatedProjectData = [...prev];
        updatedProjectData[existingLocationIndex] = {
          ...existingLocation,
          projects: [
            ...existingLocation.projects,
            { projectName, projectStatus, employeeData: [] },
          ],
        };

        isProjectAdded = true;
        return updatedProjectData;
      }

      // Add new projectLocation with the project
      isProjectAdded = true;
      return [
        ...prev,
        {
          projectLocation,
          projects: [{ projectName, projectStatus, employeeData: [] }],
        },
      ];
    });

    if (isProjectAdded) {
      setProjectLocation('');
      setProjectName('');
      toast.success('Project has been successfully created');
    }

    return isProjectAdded;
  }

  function handleClearProjectDetails(): void {
    setIsPayrollPeriodEnabled(false);
    setIsHolidaySelectionVisible(false);
    setProjectLocation('');
    setProjectName('');
    toast.success('Location and project name has been cleared');
  }

  function handleApplyDates(startDate: string, endDate: string): void {
    if (!startDate && !endDate) {
      toast.error('Please enter the payroll period');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // @TODO: Handle start and end dates to have a valid payroll period
    setDates(getDatesInRange(start, end));
    setIsAttendanceTableVisible(false);
    setIsTimeEntriesEnabled(false);
    toast.success('Payroll period has been successfully applied');
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

  function processPastedData(dates: string[], pastedText: string): EmployeeData[] {
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
      toast.error('Please select a date range before pasting data');
      return;
    }

    if (!isTimeEntriesEnabled) {
      toast.error('Please select the holidays first before proceeding');
      return;
    }

    const pastedText = event.clipboardData.getData('Text');
    const newEmployeeData = processPastedData(dates, pastedText);

    // Check if we actually have data
    if (!newEmployeeData || newEmployeeData.length === 0) {
      toast.error('No valid data was found in the pasted content');
      return;
    }

    setEmployeeData(newEmployeeData);
    setIsAttendanceTableVisible(true);

    setProjectData((prev) => {
      const updatedData = prev.map((data) => {
        if (data.projectLocation === selectedLocation) {
          return {
            ...data,
            projects: data.projects.map((project) => {
              if (project.projectName === selectedProject) {
                return {
                  ...project,
                  employeeData: [...project.employeeData, ...newEmployeeData],
                };
              }
              return project;
            }),
          };
        }
        return data;
      });

      return updatedData;
    });

    notifySuccess();
  }

  const formatValue = (value: number) => (value > 0 ? value.toFixed(2).replace(/\.00$/, '') : '');

  const handleCopy = useCallback(
    (projectLocation: string, name: string) => {
      // Find the relevant project data based on projectLocation and name
      const locationData = projectData.find((data) => data.projectLocation === projectLocation);

      if (!locationData) {
        toast.error(`Location "${projectLocation}" not found`);
        return;
      }

      const project = locationData.projects.find((project) => project.projectName === name);

      if (!project) {
        toast.error(`Project "${name}" not found in projectLocation "${projectLocation}"`);
        return;
      }

      // Use the employeeData from the specific project
      const data = project.employeeData
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
      toast.success(`Copied data for ${name} in ${projectLocation} to clipboard!`);
    },
    [projectData]
  );

  return (
    <TimeTrackerContext.Provider
      value={{
        // Project Details
        projectLocation,
        projectName,
        projectStatus,
        setProjectLocation,
        setProjectName,
        setProjectStatus,
        setProjectData,

        // Selected Project Location, Name
        selectedLocation,
        selectedProject,
        setSelectedLocation,
        setSelectedProject,

        // Payroll Period
        startDate,
        endDate,
        setStartDate,
        setEndDate,

        // Holidays
        dates,
        holidays,
        setHolidays,

        // UI
        isHolidaySelectionVisible,
        isAttendanceTableVisible,
        isTimeEntriesEnabled,
        isPayrollPeriodEnabled,
        setIsTimeEntriesEnabled,
        setIsHolidaySelectionVisible,
        setIsPayrollPeriodEnabled,

        // Functions
        handleCreateProject,
        handleClearProjectDetails,
        handleApplyDates,
        handlePaste,
        handleCopy,

        projectData,
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
