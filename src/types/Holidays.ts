type Holidays = {
  regular: { dates: Set<string> };
  specialNonWorkingHoliday: { dates: Set<string> };
  specialWorkingHoliday: { dates: Set<string> };
};

export default Holidays;
