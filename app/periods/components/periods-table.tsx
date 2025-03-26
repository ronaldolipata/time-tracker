import { useState, useEffect, useMemo } from 'react';
import { Search, SquarePen, ArrowUpDown, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTimeTracker } from '@/context/time-tracker-context';
import { toast } from 'react-toastify';
import NoTableRecord from '@/components/no-table-record';
import Link from 'next/link';
import { formatPeriod } from '@/utils/format-period';
import DeletePeriodDialog from './delete-period-dialog';
import DeleteBulkPeriodsDialog from './delete-bulk-periods-dialog';

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'startDate' | 'endDate' | null;

export default function PeriodsTable() {
  const { payrollPeriod, setPayrollPeriod } = useTimeTracker();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);

  // Function to format date to a readable string
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Function to handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Process and filter period data
  const processedPeriodData = useMemo(() => {
    if (!payrollPeriod || payrollPeriod.length === 0) return [];

    // Filter by search term (search in formatted period strings)
    const filteredPeriods = searchTerm
      ? payrollPeriod.filter((period) => {
          const periodString = `${formatDate(period.startDate)} - ${formatDate(period.endDate)}`;
          return periodString.toLowerCase().includes(searchTerm.toLowerCase());
        })
      : payrollPeriod;

    // Sort by selected field and direction
    if (sortField && sortDirection) {
      filteredPeriods.sort((a, b) => {
        let comparison = 0;
        const dateA = new Date(a[sortField]).getTime();
        const dateB = new Date(b[sortField]).getTime();

        comparison = dateA - dateB;
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filteredPeriods;
  }, [payrollPeriod, searchTerm, sortField, sortDirection]);

  // Calculate total number of filtered periods
  const totalFilteredPeriods = processedPeriodData.length;
  const isRecordsFound = totalFilteredPeriods > 0;

  // Reset selected periods when search term changes
  useEffect(() => {
    setSelectedPeriods([]);
  }, [searchTerm]);

  // Function to clear search term
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Function to handle individual checkbox selection
  function handleSelectPeriod(periodId: string): void {
    setSelectedPeriods((prev) =>
      prev.includes(periodId) ? prev.filter((id) => id !== periodId) : [...prev, periodId]
    );
  }

  function handleSelectAll(): void {
    if (processedPeriodData && processedPeriodData.length > 0) {
      const allPeriodIds = processedPeriodData.map((period, index) => `period-${index}`);
      setSelectedPeriods(allPeriodIds);
    }
  }

  function handleDeselectAll(): void {
    setSelectedPeriods([]);
  }

  function handleBulkDeletePeriod(): void {
    const updatedPeriods = payrollPeriod.filter(
      (_, index) => !selectedPeriods.includes(`period-${index}`)
    );

    setPayrollPeriod(updatedPeriods);
    toast.success('Selected periods have been successfully deleted');
    setSelectedPeriods([]);
  }

  function handleDeletePeriod(startDate: Date, endDate: Date): void {
    const updatedPeriods = payrollPeriod.filter(
      (period) =>
        period.startDate.getTime() !== startDate.getTime() ||
        period.endDate.getTime() !== endDate.getTime()
    );

    setPayrollPeriod(updatedPeriods);
    toast.success('Period has been successfully deleted');
  }

  // Memoize this calculation to avoid recalculating on every render
  const isAllSelected = totalFilteredPeriods > 0 && selectedPeriods.length === totalFilteredPeriods;

  // Helper function to get sort icon state
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return 'text-gray-400';
    return sortDirection === 'asc' ? 'text-blue-600 rotate-0' : 'text-blue-600 rotate-180';
  };

  return (
    <div className='rounded-md border'>
      <div className='flex flex-col md:flex-row justify-between p-3 gap-3'>
        <div className='flex items-center gap-2'>
          {selectedPeriods.length > 0 && (
            <DeleteBulkPeriodsDialog
              selectedCount={selectedPeriods.length}
              handleBulkDelete={handleBulkDeletePeriod}
            />
          )}
        </div>
        <div className='relative'>
          <div className='relative'>
            <Search className='h-full w-5 absolute left-0 ml-2 opacity-40' />
            <div className='flex'>
              <Input
                type='text'
                className='min-h-8 pl-8 pr-8 text-sm border cursor-pointer'
                placeholder='Search period (e.g., Jan 1, 2024 - Jan 31, 2024)'
                aria-label='Search periods'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className='h-full w-6 absolute right-0 mr-0 opacity-60 hover:opacity-100 cursor-pointer'
                  onClick={clearSearch}
                  aria-label='Clear search'
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selected count and select/deselect actions */}
      <div className='flex items-center justify-between px-3 py-2 border-t'>
        <div className='text-sm'>
          {selectedPeriods.length > 0 && (
            <span className='font-medium' aria-live='polite'>
              {selectedPeriods.length} period(s) selected
            </span>
          )}
          {searchTerm && (
            <span className='font-medium ml-2' aria-live='polite'>
              {totalFilteredPeriods} period(s) found
            </span>
          )}
        </div>
        <div className='flex gap-3'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleSelectAll}
            className='text-sm cursor-pointer'
            aria-label={`Select all ${totalFilteredPeriods} periods`}
            disabled={totalFilteredPeriods === 0}
          >
            Select all {totalFilteredPeriods}
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleDeselectAll}
            className='text-sm cursor-pointer'
            disabled={selectedPeriods.length === 0}
            aria-label='Deselect all periods'
          >
            Deselect all
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className='bg-gray-50 border-t'>
            <TableHead className='py-4 px-3 w-12'>
              <Checkbox
                id='select-all-checkbox'
                checked={isAllSelected}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleSelectAll();
                  } else {
                    handleDeselectAll();
                  }
                }}
                aria-label={isAllSelected ? 'Deselect all periods' : 'Select all periods'}
                disabled={totalFilteredPeriods === 0}
              />
            </TableHead>
            <TableHead className='py-4 px-3'>
              <div
                className='flex items-center cursor-pointer'
                onClick={() => handleSort('startDate')}
                role='button'
                tabIndex={0}
                aria-label={`Sort by start date ${
                  sortField === 'startDate' && sortDirection === 'asc' ? 'descending' : 'ascending'
                }`}
              >
                Start Date
                <ArrowUpDown
                  size={16}
                  className={`ml-1 transition-transform ${getSortIcon('startDate')}`}
                />
              </div>
            </TableHead>
            <TableHead className='py-4 px-3'>
              <div
                className='flex items-center cursor-pointer'
                onClick={() => handleSort('endDate')}
                role='button'
                tabIndex={0}
                aria-label={`Sort by end date ${
                  sortField === 'endDate' && sortDirection === 'asc' ? 'descending' : 'ascending'
                }`}
              >
                End Date
                <ArrowUpDown
                  size={16}
                  className={`ml-1 transition-transform ${getSortIcon('endDate')}`}
                />
              </div>
            </TableHead>
            <TableHead className='py-4 px-3 text-center'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isRecordsFound ? (
            processedPeriodData.map((period, index) => {
              const periodId = `period-${index}`;
              return (
                <TableRow key={periodId} className={index % 2 === 0 ? '' : 'bg-gray-50'}>
                  <TableCell className='py-4 px-3 w-12'>
                    <Checkbox
                      id={`period-checkbox-${periodId}`}
                      checked={selectedPeriods.includes(periodId)}
                      onCheckedChange={() => handleSelectPeriod(periodId)}
                      aria-label={`Select period from ${formatDate(
                        period.startDate
                      )} to ${formatDate(period.endDate)}`}
                    />
                  </TableCell>
                  <TableCell className='py-4 px-3'>{formatPeriod(period.startDate)}</TableCell>
                  <TableCell className='py-4 px-3'>{formatPeriod(period.endDate)}</TableCell>
                  <TableCell className='py-4 px-3'>
                    <div className='flex items-center justify-center gap-4 font-medium text-center'>
                      <Link
                        href={`/periods/edit?start=${encodeURIComponent(
                          period.startDate.toISOString()
                        )}&end=${encodeURIComponent(period.endDate.toISOString())}`}
                        className='flex items-center'
                        aria-label={`Edit period from ${formatDate(
                          period.startDate
                        )} to ${formatDate(period.endDate)}`}
                      >
                        <SquarePen className='mr-2' size={16} />
                        Edit
                      </Link>
                      <DeletePeriodDialog
                        startDate={period.startDate}
                        endDate={period.endDate}
                        handleDeletePeriod={handleDeletePeriod}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoTableRecord
              title={searchTerm ? 'No matching periods' : 'No periods'}
              description={{
                message: searchTerm ? 'Try searching different date' : 'Create a new period',
                messageLink: searchTerm
                  ? {
                      linkText: '',
                      href: '',
                    }
                  : {
                      linkText: 'here',
                      href: '/periods/create',
                    },
              }}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
