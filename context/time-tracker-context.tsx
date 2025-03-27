'use client';

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react';
import { EmployeeData, Holidays, PayrollPeriod, ProjectData, TimeEntry } from './types';
import { toast } from 'react-toastify';
import { addDays, format } from 'date-fns';
import { calculateSummary } from '@/helpers/calculate-summary';

type TimeTrackerType = {
  // Project Details
  projectSite: string;
  projectLocation: string;
  projectStatus: string;
  projectName: string;
  setProjectSite: Dispatch<SetStateAction<string>>;
  setProjectLocation: Dispatch<SetStateAction<string>>;
  setProjectStatus: Dispatch<SetStateAction<string>>;
  setProjectName: Dispatch<SetStateAction<string>>;
  setProjectData: Dispatch<SetStateAction<ProjectData>>;

  // Selected data
  selectedPayrollPeriod: PayrollPeriod;
  selectedLocation: string;
  selectedProject: string;
  setSelectedPayrollPeriod: Dispatch<SetStateAction<PayrollPeriod>>;
  setSelectedLocation: Dispatch<SetStateAction<string>>;
  setSelectedProject: Dispatch<SetStateAction<string>>;

  // Payroll period
  startDate: string;
  endDate: string;
  setStartDate: Dispatch<SetStateAction<string>>;
  setEndDate: Dispatch<SetStateAction<string>>;
  payrollPeriod: PayrollPeriod[];
  setPayrollPeriod: Dispatch<SetStateAction<PayrollPeriod[]>>;
  dates: string[];
  setDates: Dispatch<SetStateAction<string[]>>;

  // Holidays
  holidays: Holidays;
  setHolidays: Dispatch<SetStateAction<Holidays>>;

  // UI
  isSelectProjectEnabled: boolean;
  isHolidaySelectionVisible: boolean;
  isAttendanceTableVisible: boolean;
  isTimeEntriesEnabled: boolean;
  setIsSelectProjectEnabled: Dispatch<SetStateAction<boolean>>;
  setIsTimeEntriesEnabled: Dispatch<SetStateAction<boolean>>;
  setIsHolidaySelectionVisible: Dispatch<SetStateAction<boolean>>;

  // Functions
  handleCreateProject: (
    projectSite: string,
    projectLocation: string,
    projectName: string,
    projectStatus: string
  ) => boolean;
  handleClearProjectDetails: () => void;
  handleApplyDates: (startDate: string, endDate: string) => void;
  handlePaste: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  handleCopy: (projectSite: string, projectLocation: string, projectName: string) => void;
  handleCreatePayrollPeriod: (startDate: Date, endDate: Date, holidays: Holidays) => void;

  projectData: ProjectData;
  employeeData: EmployeeData[];
};

const TimeTrackerContext = createContext<TimeTrackerType | undefined>(undefined);

export const TimeTrackerProvider = ({ children }: { children: ReactNode }) => {
  // Project Details
  const [projectSite, setProjectSite] = useState<string>('');
  const [projectLocation, setProjectLocation] = useState<string>('');
  const [projectStatus, setProjectStatus] = useState<string>('enabled');
  const [projectName, setProjectName] = useState<string>('');

  // Track selected data
  const [selectedPayrollPeriod, setSelectedPayrollPeriod] = useState<PayrollPeriod>({
    startDate: new Date(),
    endDate: new Date(),
    holidays: {
      regular: new Set(),
      specialNonWorkingHoliday: new Set(),
      specialWorkingHoliday: new Set(),
    },
  });
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');

  const [projectData, setProjectData] = useState<ProjectData>([]);

  // Payroll period
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [payrollPeriod, setPayrollPeriod] = useState<PayrollPeriod[]>([]);

  // Holidays
  const [dates, setDates] = useState<string[]>([]);
  const [holidays, setHolidays] = useState<Holidays>({
    regular: { dates: new Set() },
    specialNonWorkingHoliday: { dates: new Set() },
    specialWorkingHoliday: { dates: new Set() },
  });

  // UI
  const [isSelectProjectEnabled, setIsSelectProjectEnabled] = useState<boolean>(false);
  const [isHolidaySelectionVisible, setIsHolidaySelectionVisible] = useState<boolean>(false);
  const [isTimeEntriesEnabled, setIsTimeEntriesEnabled] = useState<boolean>(false);
  const [isAttendanceTableVisible, setIsAttendanceTableVisible] = useState<boolean>(false);

  const [employeeData, setEmployeeData] = useState<EmployeeData[]>([]);

  // Load data from localStorage on client-side only
  useEffect(() => {
    // Load projectData
    const storedProjectData = localStorage.getItem('project-data');
    if (storedProjectData) {
      setProjectData(JSON.parse(storedProjectData));
    }

    // Load payrollPeriod
    const storedPayrollPeriod = localStorage.getItem('payroll-period');
    if (storedPayrollPeriod) {
      const parsed = JSON.parse(storedPayrollPeriod);
      setPayrollPeriod(
        parsed.map(
          (period: {
            startDate: string;
            endDate: string;
            holidays: {
              regular: string[];
              specialNonWorkingHoliday: string[];
              specialWorkingHoliday: string[];
            };
          }) => ({
            ...period,
            startDate: new Date(period.startDate),
            endDate: new Date(period.endDate),
            holidays: {
              regular: new Set(period.holidays.regular),
              specialNonWorkingHoliday: new Set(period.holidays.specialNonWorkingHoliday),
              specialWorkingHoliday: new Set(period.holidays.specialWorkingHoliday),
            },
          })
        )
      );
    }
  }, []); // Empty dependency array means this runs once on mount

  // Update localStorage when projectData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('project-data', JSON.stringify(projectData));
    }
  }, [projectData]);

  // Update localStorage when payrollPeriod changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const serializedPeriods = payrollPeriod.map((period) => ({
        ...period,
        startDate: period.startDate.toISOString(),
        endDate: period.endDate.toISOString(),
        holidays: {
          regular: Array.from(period.holidays.regular),
          specialNonWorkingHoliday: Array.from(period.holidays.specialNonWorkingHoliday),
          specialWorkingHoliday: Array.from(period.holidays.specialWorkingHoliday),
        },
      }));
      localStorage.setItem('payroll-period', JSON.stringify(serializedPeriods));
    }
  }, [payrollPeriod]);

  function notifySuccess() {
    toast.success('Time entries successfully entered!', {
      position: 'top-right',
      autoClose: 3000,
    });
  }

  function handleCreateProject(
    projectSite: string,
    projectLocation: string,
    projectName: string,
    projectStatus: string
  ): boolean {
    if (!projectSite || !projectLocation || !projectName || !projectStatus) {
      toast.error('Please the required details');
      return false;
    }

    let isProjectAdded = false; // Track if a project was actually added

    setProjectData((prev) => {
      const existingSiteIndex = prev.findIndex(
        (data) => data.projectSite.toLowerCase() === projectSite.toLowerCase()
      );

      if (existingSiteIndex !== -1) {
        const existingSite = prev[existingSiteIndex];

        const existingProject = existingSite.projects.find(
          (project) => project.projectName.toLowerCase() === projectName.toLowerCase()
        );

        if (existingProject) {
          toast.error('Name already exists for the site');
          return prev; // No changes, return existing state
        }

        // Add new project to existing site
        const updatedProjectData = [...prev];
        updatedProjectData[existingSiteIndex] = {
          ...existingSite,
          projects: [
            ...existingSite.projects,
            { projectLocation, projectName, projectStatus, employeeData: [] },
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
          projectSite,
          projectLocation,
          projects: [{ projectLocation, projectName, projectStatus, employeeData: [] }],
        },
      ];
    });

    if (isProjectAdded) {
      setProjectSite('');
      setProjectLocation('');
      setProjectName('');
      toast.success('Successfully created');
    }

    return isProjectAdded;
  }

  function handleClearProjectDetails(): void {
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
    setDates(getDatesInRange(start, end)); // Used to apply the dates for employee's data
    setPayrollPeriod((prev) => [
      ...prev,
      {
        startDate: start,
        endDate: end,
        holidays: {
          regular: new Set(),
          specialNonWorkingHoliday: new Set(),
          specialWorkingHoliday: new Set(),
        },
      },
    ]); // Used for displaying payroll period
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

        // Transform the holidays structure to match the expected type
        const transformedHolidays: Holidays = {
          regular: { dates: selectedPayrollPeriod.holidays.regular },
          specialNonWorkingHoliday: {
            dates: selectedPayrollPeriod.holidays.specialNonWorkingHoliday,
          },
          specialWorkingHoliday: { dates: selectedPayrollPeriod.holidays.specialWorkingHoliday },
        };

        return {
          name,
          timeEntries,
          summary: calculateSummary(timeEntries, transformedHolidays),
        };
      });
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    if (payrollPeriod.length < 0) {
      toast.error('Please select a payroll period before pasting time entries');
      return;
    }

    if (!isTimeEntriesEnabled) {
      toast.error('Please select the holidays first before proceeding');
      return;
    }

    const dateRange = getDatesInRange(
      selectedPayrollPeriod.startDate,
      selectedPayrollPeriod.endDate
    );
    const pastedText = event.clipboardData.getData('Text');
    const newEmployeeData = processPastedData(dateRange, pastedText);

    // Check if we actually have data
    if (!newEmployeeData || newEmployeeData.length === 0) {
      toast.error('No valid data was found in the pasted content');
      return;
    }

    setEmployeeData(newEmployeeData);
    setIsAttendanceTableVisible(true);

    setProjectData((prev) => {
      const updatedData = prev.map((data) => {
        if (data.projectSite === projectSite) {
          return {
            ...data,
            projects: data.projects.map((project) => {
              if (project.projectName === selectedProject) {
                return {
                  ...project,
                  employeeData: newEmployeeData,
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
    (projectSite: string, projectLocation: string, name: string) => {
      // Find the relevant project data based on projectLocation and name
      const locationData = projectData.find((data) => data.projectSite === projectSite);

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
      toast.success(`Copied data to clipboard!`);
    },
    [projectData, projectSite]
  );

  const handleCreatePayrollPeriod = (startDate: Date, endDate: Date, holidays: Holidays): void => {
    // Validate dates
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    // Validate date range
    if (endDate < startDate) {
      toast.error('End date cannot be before start date');
      return;
    }

    // Create new period with holidays
    const newPeriod: PayrollPeriod = {
      startDate,
      endDate,
      holidays: {
        regular: new Set(holidays.regular.dates),
        specialNonWorkingHoliday: new Set(holidays.specialNonWorkingHoliday.dates),
        specialWorkingHoliday: new Set(holidays.specialWorkingHoliday.dates),
      },
    };

    // Add to existing periods
    setPayrollPeriod((prev) => [...prev, newPeriod]);

    // Reset form state
    setStartDate('');
    setEndDate('');
    setDates([]);
    setHolidays({
      regular: { dates: new Set() },
      specialNonWorkingHoliday: { dates: new Set() },
      specialWorkingHoliday: { dates: new Set() },
    });

    toast.success('Payroll period created successfully');
  };

  return (
    <TimeTrackerContext.Provider
      value={{
        // Project Details
        projectSite,
        projectLocation,
        projectName,
        projectStatus,
        setProjectSite,
        setProjectLocation,
        setProjectName,
        setProjectStatus,
        setProjectData,

        // Selected data
        selectedPayrollPeriod,
        selectedLocation,
        selectedProject,
        setSelectedPayrollPeriod,
        setSelectedLocation,
        setSelectedProject,

        // Payroll period
        startDate,
        endDate,
        setStartDate,
        setEndDate,
        payrollPeriod,
        setPayrollPeriod,
        dates,
        setDates,

        // Holidays
        holidays,
        setHolidays,

        // UI
        isSelectProjectEnabled,
        isHolidaySelectionVisible,
        isAttendanceTableVisible,
        isTimeEntriesEnabled,
        setIsSelectProjectEnabled,
        setIsTimeEntriesEnabled,
        setIsHolidaySelectionVisible,

        // Functions
        handleCreateProject,
        handleClearProjectDetails,
        handleApplyDates,
        handlePaste,
        handleCopy,
        handleCreatePayrollPeriod,

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
