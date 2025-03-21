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

  const hasEmployeeData = (projectLocation: string, name: string) => {
    const locationData = projectData.find((data) => data.projectLocation === projectLocation);
    if (!locationData) return false;

    const project = locationData.projects.find((p) => p.name === name);
    return project?.employeeData && project.employeeData.length > 0;
  };

  return (
    <div>
      <Card className='w-full gap-4 p-4'>
        <div className='flex flex-col gap-2'>
          <CardTitle>Projects Data</CardTitle>
          <CardDescription>Show data by projectLocation and project name</CardDescription>
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
              {projectData.flatMap(({ projectLocation, projects }) =>
                projects.map(({ name }) => (
                  <TableRow key={`${projectLocation}-${name}`}>
                    <TableCell className='pl-4 text-left'>{projectLocation}</TableCell>
                    <TableCell className='p-2'>{name}</TableCell>
                    <TableCell className='p-2'>
                      <Button
                        className={'focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'}
                        onClick={() => handleCopy(projectLocation, name)}
                        disabled={!hasEmployeeData(projectLocation, name)}
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
