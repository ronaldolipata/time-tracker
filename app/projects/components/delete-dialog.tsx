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

type DeleteDialogProps = {
  projectSite: string;
  projectLocation: string;
  projectName: string;
  onDelete: (projectSite: string, projectLocation: string, projectName: string) => void;
};

export default function DeleteDialog({
  projectSite,
  projectLocation,
  projectName,
  onDelete,
}: DeleteDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className='flex items-center text-red-600 cursor-pointer'
        aria-label={`Delete ${projectName} project`}
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
            This action cannot be undone. This will permanently delete the project of{' '}
            <span className='font-semibold text-red-600'>{projectName}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className='bg-red-600 hover:bg-red-500 cursor-pointer'
            onClick={() => onDelete(projectSite, projectLocation, projectName)}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
