'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CustomLink } from '@/components/custom-link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DynamicBreadcrumbs } from '@/components/dynamic-breadcrumbs';
import PeriodsTable from './components/periods-table';
import { SuspenseWrapper } from '@/components/ui/SuspenseWrapper';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

function PeriodsContent() {
  const router = useRouter();
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
        <PeriodsTable />
      </div>
    </>
  );
}

export default function Periods() {
  return (
    <ErrorBoundary>
      <SuspenseWrapper>
        <PeriodsContent />
      </SuspenseWrapper>
    </ErrorBoundary>
  );
}
