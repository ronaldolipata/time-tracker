import { useTimeTracker } from '@/context/time-tracker-context';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import Link from 'next/link';

export default function PayrollPeriod() {
  const { payrollPeriod, setSelectedPayrollPeriod, setIsSelectProjectEnabled } = useTimeTracker();

  return (
    <Card className='w-full gap-6 p-6'>
      <div className='flex flex-col gap-2'>
        <CardTitle>Select Payroll Period</CardTitle>
        <CardDescription>Select to enter project details</CardDescription>
      </div>

      <div className='flex flex-col lg:flex-row gap-4'>
        <Select
          onValueChange={(value) => {
            const selectedPeriod = payrollPeriod.find(({ startDate, endDate }) => {
              const formatted = `${format(startDate, 'MMMM dd, yyyy')} - ${format(
                endDate,
                'MMMM dd, yyyy'
              )}`;
              return formatted === value; // Find the matching period
            });

            if (selectedPeriod) {
              setSelectedPayrollPeriod(selectedPeriod); // Set the correct object
              setIsSelectProjectEnabled(true);
            }
          }}
        >
          <SelectTrigger className='w-full truncate'>
            <SelectValue placeholder='Select payroll period' />
          </SelectTrigger>
          <SelectContent>
            {payrollPeriod.length > 0 ? (
              payrollPeriod.map(({ startDate, endDate }) => {
                const formattedPeriod = `${format(startDate, 'MMMM dd, yyyy')} - ${format(
                  endDate,
                  'MMMM dd, yyyy'
                )}`;

                return (
                  <SelectItem key={formattedPeriod} value={formattedPeriod}>
                    {formattedPeriod}
                  </SelectItem>
                );
              })
            ) : (
              <div className='p-2 text-center text-sm text-muted-foreground'>
                <p>No payroll periods available.</p>
                <p>
                  Please create{' '}
                  <Link className='!text-blue-600' href={'/periods/create'}>
                    here
                  </Link>
                  .
                </p>
              </div>
            )}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
