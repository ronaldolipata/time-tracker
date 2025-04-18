import { TableCell, TableRow } from './ui/table';
import { X } from 'lucide-react';
import Link from 'next/link';

interface MeesageLink {
  linkText: string;
  href: string;
}

interface Description {
  message: string;
  messageLink?: MeesageLink;
}

interface NoTableRecordProps {
  title: string;
  description?: Description;
}

export default function NoTableRecord({ title, description }: NoTableRecordProps) {
  return (
    <TableRow className='hover:bg-transparent'>
      <TableCell colSpan={8} className='h-60 text-center'>
        <div className='flex flex-col gap-2'>
          <div className='self-center p-2 bg-gray-100 rounded-full'>
            <X size={24} className='text-gray-400' />
          </div>
          <div className='flex flex-col'>
            <span className='text-xl font-medium'>{title}</span>
            {description && (
              <span className='text-muted-foreground'>
                {description.message}{' '}
                {description.messageLink && (
                  <Link
                    className='text-blue-400 cursor-pointer'
                    href={description.messageLink.href}
                  >
                    {description.messageLink.linkText}
                  </Link>
                )}
              </span>
            )}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}
