import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash } from 'lucide-react';
import { formatPeriod } from '@/utils/format-period';

type DeletePeriodDialogProps = {
  startDate: Date;
  endDate: Date;
  handleDeletePeriod: (startDate: Date, endDate: Date) => void;
};

export default function DeletePeriodDialog({
  startDate,
  endDate,
  handleDeletePeriod,
}: DeletePeriodDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className='flex items-center text-red-600 cursor-pointer'
        aria-label={`Delete period from ${formatPeriod(startDate)} to ${formatPeriod(endDate)}`}
      >
        <Trash className='mr-2' size={16} /> Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className='items-center lg:items-start'>
          <div className='md:self-start p-2 bg-red-100 rounded-full'>
            <Trash size={24} className='text-red-400' />
          </div>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the period from{' '}
            <span className='font-semibold text-red-600'>{formatPeriod(startDate)}</span> to{' '}
            <span className='font-semibold text-red-600'>{formatPeriod(endDate)}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className='bg-red-600 hover:bg-red-500 cursor-pointer'
            onClick={() => handleDeletePeriod(startDate, endDate)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
