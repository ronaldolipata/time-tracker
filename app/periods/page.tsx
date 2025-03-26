'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CustomLink } from '@/components/custom-link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DynamicBreadcrumbs } from '@/components/dynamic-breadcrumbs';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import PeriodsTable from './components/periods-table';

export default function Periods() {
  const router = useRouter();

  return (
    <>
      <ToastContainer />
      <div className='flex flex-col gap-8 py-8'>
        <div className='flex flex-col lg:flex-row lg:justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <DynamicBreadcrumbs />
            <h1 className='text-3xl font-bold'>Payroll Period</h1>
          </div>
          <CustomLink href='/periods/create' className='self-end cursor-pointer'>
            Create payroll period
          </CustomLink>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          {/* Extract just the part that needs searchParams */}
          <ProjectSuccessHandler router={router} />
        </Suspense>
        <PeriodsTable />
      </div>
    </>
  );
}

function ProjectSuccessHandler({ router }: { router: AppRouterInstance }) {
  const searchParams = useSearchParams();
  const successMessage = searchParams.get('success');

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      router.replace(url.pathname);
    }
  }, [successMessage, router]);

  return null; // This component just handles the side effect
}
