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
import { Button } from '@/components/ui/button';

type DeleteBulkPeriodsDialogProps = {
  selectedCount: number;
  handleBulkDelete: () => void;
};

export default function DeleteBulkPeriodsDialog({
  selectedCount,
  handleBulkDelete,
}: DeleteBulkPeriodsDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant='destructive'
          size='sm'
          className='flex items-center gap-2 cursor-pointer'
          aria-label={`Delete ${selectedCount} selected period(s)`}
        >
          <Trash size={16} />
          Delete selected
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader className='items-center lg:items-start'>
          <div className='md:self-start p-2 bg-red-100 rounded-full'>
            <Trash size={24} className='text-red-400' />
          </div>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{' '}
            <span className='font-semibold text-red-600'>{selectedCount}</span> selected period(s).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className='bg-red-600 hover:bg-red-500 cursor-pointer'
            onClick={handleBulkDelete}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
