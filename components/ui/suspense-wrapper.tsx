'use client';

import { Suspense } from 'react';
import { Spinner } from './Spinner';

interface SuspenseWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SuspenseWrapper({ children, fallback }: SuspenseWrapperProps) {
  return <Suspense fallback={fallback || <Spinner />}>{children}</Suspense>;
}
