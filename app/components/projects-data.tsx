import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTimeTracker } from '@/context/time-tracker-context';
import { Copy, X } from 'lucide-react';

export default function ProjectsData() {
  const { projectData, handleCopy } = useTimeTracker();

  const hasEmployeeData = (projectLocation: string, name: string) => {
    const locationData = projectData.find((data) => data.projectLocation === projectLocation);
    if (!locationData) return false;

    const project = locationData.projects.find((project) => project.projectName === name);
    return project?.employeeData && project.employeeData.length > 0;
  };

  return (
    <div>
      <Card className='w-full gap-4 p-4'>
        <div className='flex flex-col gap-2'>
          <CardTitle>Projects Data</CardTitle>
          <CardDescription>Show data by project location and name</CardDescription>
        </div>
        <div className='flex flex-col gap-4 rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow className='bg-gray-50'>
                <TableHead className='py-4 px-3 w-12'>Location</TableHead>
                <TableHead className='py-4 px-3 w-12'>Name</TableHead>
                <TableHead className='py-4 px-3 w-12'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectData.length > 0 ? (
                projectData.flatMap(({ projectLocation, projects }) =>
                  projects.map(({ projectName }, subIndex) => (
                    <TableRow
                      key={`${projectLocation}-${projectName}`}
                      className={subIndex % 2 === 0 ? '' : 'bg-gray-50'}
                    >
                      <TableCell className='py-4 px-3'>{projectLocation}</TableCell>
                      <TableCell className='py-4 px-3'>{projectName}</TableCell>
                      <TableCell className='p-2'>
                        <Button
                          className={'p-0 focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'}
                          onClick={() => handleCopy(projectLocation, projectName)}
                          disabled={!hasEmployeeData(projectLocation, projectName)}
                        >
                          <Copy />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )
              ) : (
                <TableRow className='hover:bg-transparent'>
                  <TableCell colSpan={5} className='h-60 text-center'>
                    <div className='flex flex-col gap-2'>
                      <div className='self-center p-2 bg-gray-100 rounded-full'>
                        <X size={24} className='text-gray-400' />
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-xl font-medium'>No data</span>
                        <span className='text-muted-foreground'>Insert time entries</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
