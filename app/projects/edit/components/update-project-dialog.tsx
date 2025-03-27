'use client';

import { useState } from 'react';
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
import { Button } from '@/components/ui/button';

interface UpdateProjectDialogProps {
  projectSite: string;
  projectLocation: string;
  projectName: string;
  projectStatus: string;
  onUpdate: () => void;
  disabled?: boolean;
}

export default function UpdateProjectDialog({
  projectSite,
  projectLocation,
  projectName,
  projectStatus,
  onUpdate,
  disabled = false,
}: UpdateProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = () => {
    if (!projectSite || !projectLocation || !projectName || !projectStatus) {
      return;
    }

    onUpdate();
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className='cursor-pointer' disabled={disabled}>
          Update
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Project</AlertDialogTitle>
          <div className='space-y-6'>
            <AlertDialogDescription className='text-muted-foreground'>
              Are you sure you want to update this project?
            </AlertDialogDescription>
            <div className='grid gap-1 bg-muted p-5 text-sm rounded-md'>
              <p className='font-medium text-foreground'>Changes to be made:</p>
              <ul className='grid gap-1 list-disc list-inside mt-1 space-y-1 text-muted-foreground'>
                <li>Site: {projectSite}</li>
                <li>Location: {projectLocation}</li>
                <li>Name: {projectName}</li>
                <li>Status: {projectStatus}</li>
              </ul>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
          <AlertDialogAction className='cursor-pointer' onClick={handleUpdate}>
            Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
