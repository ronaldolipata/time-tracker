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
import { formatPeriod } from '@/utils/format-period';

interface UpdatePeriodDialogProps {
  startDate: string;
  endDate: string;
  onUpdate: (startDate: string, endDate: string) => void;
  disabled?: boolean;
}

export default function UpdatePeriodDialog({
  startDate,
  endDate,
  onUpdate,
  disabled = false,
}: UpdatePeriodDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = () => {
    if (!startDate || !endDate) {
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return;
    }

    onUpdate(startDate, endDate);
    setIsOpen(false);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Invalid date';
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Invalid date' : formatPeriod(date);
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
          <AlertDialogTitle>Update Payroll Period</AlertDialogTitle>
          <AlertDialogDescription>
            <div className='space-y-2'>
              <p>Are you sure you want to update this period?</p>
              <div className='bg-gray-50 p-4 rounded-md'>
                <p className='font-medium'>Changes to be made:</p>
                <ul className='list-disc list-inside mt-1 space-y-1'>
                  <li>Start date: {formatDate(startDate)}</li>
                  <li>End date: {formatDate(endDate)}</li>
                  <li>Holiday settings</li>
                </ul>
              </div>
            </div>
          </AlertDialogDescription>
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
