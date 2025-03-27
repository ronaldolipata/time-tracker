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

  const hasEmployeeData = (projectSite: string, projectLocation: string, projectName: string) => {
    const siteData = projectData.find((data) => data.projectSite === projectSite);
    if (!siteData) return false;

    const project = siteData.projects.find(
      (project) =>
        project.projectLocation === projectLocation && project.projectName === projectName
    );
    return project?.employeeData && project.employeeData.length > 0;
  };

  return (
    <div>
      <Card className='w-full gap-5 p-5'>
        <div className='flex flex-col gap-2'>
          <CardTitle>Projects Data</CardTitle>
          <CardDescription>Show data by project site, location and name</CardDescription>
        </div>
        <div className='flex flex-col gap-4 rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/50'>
                <TableHead className='py-4 px-3 w-12'>Site</TableHead>
                <TableHead className='py-4 px-3 w-12'>Location</TableHead>
                <TableHead className='py-4 px-3 w-12'>Name</TableHead>
                <TableHead className='py-4 px-3 w-12'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectData.length > 0 ? (
                projectData.flatMap(({ projectSite, projects }) =>
                  projects.map(({ projectLocation, projectName }, subIndex) => (
                    <TableRow
                      key={`${projectSite}-${projectLocation}-${projectName}`}
                      className={subIndex % 2 === 0 ? '' : 'bg-muted/50'}
                    >
                      <TableCell className='py-4 px-3'>{projectSite}</TableCell>
                      <TableCell className='py-4 px-3'>{projectLocation}</TableCell>
                      <TableCell className='py-4 px-3'>{projectName}</TableCell>
                      <TableCell className='p-2'>
                        <Button
                          className='p-0 cursor-pointer'
                          onClick={() => handleCopy(projectSite, projectLocation, projectName)}
                          disabled={!hasEmployeeData(projectSite, projectLocation, projectName)}
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
