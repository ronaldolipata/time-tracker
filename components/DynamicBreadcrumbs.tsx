'use client';

import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function DynamicBreadcrumbs() {
  const pathname = usePathname(); // Get the current route (e.g., "/projects/create")
  const segments = pathname.split('/').filter((segment) => segment); // Remove empty values

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/'>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`; // Create the breadcrumb URL
          const formattedName = segment.charAt(0).toUpperCase() + segment.slice(1); // Capitalize segment

          return (
            <div key={href} className='flex items-center gap-2'>
              <BreadcrumbSeparator>
                <ChevronRight className='w-4 h-4' />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                {index === segments.length - 1 ? (
                  <BreadcrumbPage>{formattedName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{formattedName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
