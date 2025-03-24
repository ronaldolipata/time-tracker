'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CustomLink } from '@/components/CustomLink';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DynamicBreadcrumbs } from '@/components/DynamicBreadcrumbs';
import ProjectsTable from './components/ProjectsTable';

export default function Projects() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const successMessage = searchParams.get('success');

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      // Create a URL without the success parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('success');

      // Replace current URL without the success parameter
      router.replace(url.pathname);
    }
  }, [successMessage, router]);

  return (
    <>
      <ToastContainer />
      <div className='flex flex-col gap-8 py-8'>
        <div className='flex flex-col lg:flex-row lg:justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <DynamicBreadcrumbs />
            <h1 className='text-3xl font-bold'>Projects</h1>
          </div>
          <CustomLink href='/projects/create' className='self-end cursor-pointer'>
            Create project
          </CustomLink>
        </div>
        <ProjectsTable />
      </div>
    </>
  );
}
