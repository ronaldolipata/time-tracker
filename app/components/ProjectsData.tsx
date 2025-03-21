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
import { useTimeTracker } from '@/context/TimeTrackerContext';
import React from 'react';

export default function ProjectsData() {
  const { projectData, handleCopy } = useTimeTracker();

  const hasEmployeeData = (location: string, projectName: string) => {
    const locationData = projectData.find((data) => data.location === location);
    if (!locationData) return false;

    const project = locationData.projects.find((p) => p.projectName === projectName);
    return project?.employeeData && project.employeeData.length > 0;
  };

  return (
    <div>
      <Card className='w-full gap-4 p-4'>
        <div className='flex flex-col gap-2'>
          <CardTitle>Projects Data</CardTitle>
          <CardDescription>Show data by location and project name</CardDescription>
        </div>
        <div className='flex flex-col gap-4 rounded-md border'>
          <Table className='text-center'>
            <TableHeader>
              <TableRow>
                <TableHead className='pl-4'>Location</TableHead>
                <TableHead className='text-center'>Project Name</TableHead>
                <TableHead className='text-center'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectData.flatMap(({ location, projects }) =>
                projects.map(({ projectName }) => (
                  <TableRow key={`${location}-${projectName}`}>
                    <TableCell className='pl-4 text-left'>{location}</TableCell>
                    <TableCell className='p-2'>{projectName}</TableCell>
                    <TableCell className='p-2'>
                      <Button
                        className={'focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'}
                        onClick={() => handleCopy(location, projectName)}
                        disabled={!hasEmployeeData(location, projectName)}
                      >
                        Copy data
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
