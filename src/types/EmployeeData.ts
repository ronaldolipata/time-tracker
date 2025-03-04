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
