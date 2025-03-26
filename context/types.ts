export type PayrollPeriod = {
  startDate: Date;
  endDate: Date;
  holidays: {
    regular: Set<string>;
    specialNonWorkingHoliday: Set<string>;
    specialWorkingHoliday: Set<string>;
  };
};

export type TimeEntry = {
  date: string;
  timeIn: string;
  timeOut: string;
};

export type Holidays = {
  regular: { dates: Set<string> };
  specialNonWorkingHoliday: { dates: Set<string> };
  specialWorkingHoliday: { dates: Set<string> };
};

export type Summary = {
  totalRegularWorkDays: number;
  totalSundayDays: number;
  totalSundayOvertime: number;
  totalRegularOvertime: number;
  totalRegularHoliday: number;
  totalRegularHolidayOvertime: number;
  nightshift?: number;
  nightshiftOvertime?: number;
  totalSpecialNonWorkingHoliday: number;
  totalSpecialWorkingHoliday: number;
};

export type EmployeeData = {
  name: string;
  timeEntries: TimeEntry[];
  summary: Summary;
};

export type ProjectData = {
  projectLocation: string;
  projects: {
    projectName: string;
    projectStatus: string;
    employeeData: EmployeeData[];
  }[];
}[];
