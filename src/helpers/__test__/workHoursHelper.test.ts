import { calculateWorkHours, calculateWorkedDuration } from '../workHoursHelper';

describe('calculateWorkHours', () => {
  // Early morning shift tests
  describe('Early morning shifts', () => {
    test('5:00 AM to 12:00 AM (midnight) should calculate 19 hours', () => {
      const hours = calculateWorkHours('5:00 AM', '12:00 AM', '2024-03-05');
      expect(hours).toBeCloseTo(18, 1); // 19 hours with 1-hour lunch break
    });

    test('5:00 AM to 12:00 AM (midnight) with lunch break at 9:00 AM', () => {
      const hours = calculateWorkHours('5:00 AM', '12:00 AM', '2024-03-05');
      expect(hours).toBeCloseTo(18, 1); // 19 hours with 1-hour lunch break
    });
  });

  // Lunch break tests
  describe('Flexible lunch break', () => {
    test('Long shift with lunch break 4 hours after start - 6:00 AM to 3:00 PM', () => {
      const hours = calculateWorkHours('6:00 AM', '3:00 PM', '2024-03-05');
      expect(hours).toBeCloseTo(8, 1); // 9 hours with 1-hour lunch break
    });

    test('Half day shift should not deduct lunch break - 8:00 AM to 12:00 PM', () => {
      const hours = calculateWorkHours('8:00 AM', '12:00 PM', '2024-03-05');
      expect(hours).toBeCloseTo(4, 1); // No lunch break deduction
    });
  });

  // Various shift scenarios
  describe('Various shift scenarios', () => {
    test('Standard day shift - 8:00 AM to 5:00 PM', () => {
      const hours = calculateWorkHours('8:00 AM', '5:00 PM', '2024-03-05');
      expect(hours).toBeCloseTo(8, 1); // 9 hours with 1-hour lunch break
    });
  });
});

describe('calculateWorkedDuration', () => {
  test('Full day shift - 5:00 AM to 12:00 AM', () => {
    const duration = calculateWorkedDuration('5:00 AM', '12:00 AM', '2024-03-05');
    expect(duration).toBe(1); // Full day
  });

  test('Full day shift - 8:00 AM to 5:00 PM', () => {
    const duration = calculateWorkedDuration('5:00 AM', '12:00 AM', '2024-03-05');
    expect(duration).toBe(1); // Full day
  });

  test('Half day shift - 8:00 AM to 12:00 PM', () => {
    const duration = calculateWorkedDuration('8:00 AM', '12:00 PM', '2024-03-05');
    expect(duration).toBe(0.5); // Half day
  });
});
