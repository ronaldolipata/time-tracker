export type TimeEntry = {
  date: string;
  timeIn: string;
  timeOut: string;
};

export type Summary = {
  totalRegularWorkDays: number;
  totalSundayDays: number;
  totalSundayOvertime: number;
  totalRegularOvertime: number;
  totalRegularHoliday: number;
  regularHolidayOvertime?: number;
  nightshift?: number;
  nightshiftOvertime?: number;
  specialNonWorkingHoliday?: number;
  specialWorkingHoliday?: number;
};

export type EmployeeData = {
  name: string;
  timeEntries: TimeEntry[];
  summary: Summary;
};
