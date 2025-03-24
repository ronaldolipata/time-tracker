import { useTimeTracker } from '@/context/time-tracker-context';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function PayrollPeriod() {
  const {
    payrollPeriod,
    selectedPayrollPeriod,
    setSelectedPayrollPeriod,
    setIsSelectProjectEnabled,
  } = useTimeTracker();

  return (
    <Card className='w-full gap-4 p-4'>
      <div className='flex flex-col gap-2'>
        <CardTitle>Select payroll period</CardTitle>
        <CardDescription>Select to enter project details</CardDescription>
      </div>

      <div className='flex flex-col lg:flex-row gap-4'>
        <Select
          disabled={!payrollPeriod.length}
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
            }
          }}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select project location' />
          </SelectTrigger>
          <SelectContent>
            {payrollPeriod.map(({ startDate, endDate }) => {
              const formattedPeriod = `${format(startDate, 'MMMM dd, yyyy')} - ${format(
                endDate,
                'MMMM dd, yyyy'
              )}`;

              return (
                <SelectItem key={formattedPeriod} value={formattedPeriod}>
                  {formattedPeriod}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        <Button
          className='focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'
          onClick={() => setIsSelectProjectEnabled(true)}
          disabled={!selectedPayrollPeriod || !payrollPeriod.length}
        >
          Select
        </Button>
      </div>
    </Card>
  );
}
