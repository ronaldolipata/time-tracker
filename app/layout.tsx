import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TimeTrackerProvider } from '@/context/TimeTrackerContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Time Tracker',
  description:
    'A simple web app for HR to track employee workdays, overtime, and attendance. It automates calculations, streamlining payroll and reporting for accurate workforce management.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className='min-h-screen flex flex-col'>
          <div className='flex-grow'>
            <div className='2xl:w-[100rem] lg:mx-auto'>
              <div className='w-full px-5 md:px-8 mx-auto'>
                <TimeTrackerProvider>{children}</TimeTrackerProvider>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
