'use client';

import { useState, useEffect, MouseEventHandler } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search, SquarePen, Trash, X } from 'lucide-react';

import { CustomLink } from '@/components/CustomLink';
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
import { DynamicBreadcrumbs } from '@/components/DynamicBreadcrumbs';
import { useTimeTracker } from '@/context/TimeTrackerContext';
import { ProjectData } from '@/context/types';
import DeleteDialog from './components/DeleteDialog';

export default function Projects() {
  const { projectData, setProjectData } = useTimeTracker();
  const router = useRouter();
  const searchParams = useSearchParams();
  const successMessage = searchParams.get('success');

  // Calculate total number of projects
  const totalProjects = projectData
    ? projectData.reduce((sum, location) => sum + location.projects.length, 0)
    : 0;

  // State for selected projects - using a properly typed state
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  // Function to handle individual checkbox selection
  function handleSelectProject(projectId: string): void {
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  }

  function handleSelectAll(): void {
    if (projectData && projectData.length > 0) {
      const allProjectIds = projectData.flatMap((location) =>
        location.projects.map((project) => `${location.projectLocation}-${project.projectName}`)
      );
      setSelectedProjects(allProjectIds);
    }
  }

  function handleDeselectAll(): void {
    setSelectedProjects([]);
  }

  function handleBulkDeleteProject(): void {
    if (selectedProjects.length > 0) {
      setProjectData(
        (prevProjectData: ProjectData) =>
          prevProjectData
            .map((location) => ({
              ...location,
              projects: location.projects.filter(
                (project) =>
                  !selectedProjects.includes(`${location.projectLocation}-${project.projectName}`)
              ),
            }))
            .filter((location) => location.projects.length > 0) // Remove empty project locations
      );

      toast.success('Bulk deletion has been successful');
      setSelectedProjects([]);
    }
  }

  function handleDeleteProject(
    projectLocation: string,
    projectName: string
  ): MouseEventHandler<HTMLButtonElement> | undefined {
    setProjectData(
      (prevProjectData: ProjectData) =>
        prevProjectData
          .map((location) => ({
            ...location,
            projects: location.projects.filter(
              (project) =>
                !(
                  location.projectLocation === projectLocation &&
                  project.projectName === projectName
                )
            ),
          }))
          .filter((location) => location.projects.length > 0) // Remove empty project locations
    );

    toast.success('Project has been successfully deleted');
    return;
  }

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

  // Memoize this calculation to avoid recalculating on every render
  const isAllSelected = totalProjects > 0 && selectedProjects.length === totalProjects;
  const isPartiallySelected =
    selectedProjects.length > 0 && selectedProjects.length < totalProjects;

  return (
    <>
      <ToastContainer />
      <div className='flex flex-col gap-8 py-4'>
        <div className='flex flex-col lg:flex-row lg:justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <DynamicBreadcrumbs />
            <h1 className='text-3xl font-bold'>Projects</h1>
          </div>
          <CustomLink href='/projects/create' className='self-end cursor-pointer'>
            Create project
          </CustomLink>
        </div>
        <div className='rounded-md border'>
          <div className='flex flex-col md:flex-row justify-between p-3 gap-3'>
            <div className='flex items-center gap-2'>
              {selectedProjects.length > 0 && (
                <Button
                  variant='destructive'
                  size='sm'
                  className='flex items-center gap-2 cursor-pointer'
                  onClick={handleBulkDeleteProject}
                  aria-label='Delete selected projects'
                >
                  <Trash size={16} />
                  Delete Selected
                </Button>
              )}
            </div>
            <div className='relative'>
              <div>
                <Search className='h-full w-5 absolute left-0 ml-2 opacity-40' />
                <Input
                  type='text'
                  className='min-h-8 pl-8 text-sm border cursor-pointer'
                  placeholder='Search project'
                  aria-label='Search projects'
                />
              </div>
            </div>
          </div>

          {/* Selected count and select/deselect actions */}
          <div className='flex items-center justify-between px-3 py-2 border-t'>
            <div className='text-sm'>
              {selectedProjects.length > 0 && (
                <span className='font-medium' aria-live='polite'>
                  {selectedProjects.length} project(s) selected
                </span>
              )}
            </div>
            <div className='flex gap-3'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleSelectAll}
                className='text-sm'
                aria-label={`Select all ${totalProjects} projects`}
              >
                Select all {totalProjects}
              </Button>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleDeselectAll}
                className='text-sm'
                disabled={selectedProjects.length === 0}
                aria-label='Deselect all projects'
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
                    indeterminate={isPartiallySelected}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleSelectAll();
                      } else {
                        handleDeselectAll();
                      }
                    }}
                    aria-label={isAllSelected ? 'Deselect all projects' : 'Select all projects'}
                  />
                </TableHead>
                <TableHead className='py-4 px-3'>Location</TableHead>
                <TableHead className='py-4 px-3'>Name</TableHead>
                <TableHead className='py-4 px-3'>Status</TableHead>
                <TableHead className='py-4 px-3 text-center'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectData && projectData.length > 0 ? (
                projectData.flatMap(({ projectLocation, projects }) =>
                  projects.map(({ projectStatus, projectName }, subIndex) => {
                    const projectId = `${projectLocation}-${projectName}`;
                    return (
                      <TableRow
                        key={projectId}
                        className={subIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <TableCell className='py-4 px-3 w-12'>
                          <Checkbox
                            id={`project-checkbox-${projectId}`}
                            checked={selectedProjects.includes(projectId)}
                            onCheckedChange={() => handleSelectProject(projectId)}
                            aria-label={`Select ${projectName} project`}
                          />
                        </TableCell>
                        <TableCell className='py-4 px-3'>{projectLocation}</TableCell>
                        <TableCell className='p-2'>{projectName}</TableCell>
                        <TableCell className='first-letter:uppercase p-2'>
                          {projectStatus}
                        </TableCell>
                        <TableCell className='p-2'>
                          <div className='flex items-center justify-center gap-4 font-medium text-center'>
                            <Link
                              href={`projects/edit?project=${encodeURIComponent(projectId)}`}
                              className='flex items-center'
                              aria-label={`Edit ${projectName} project`}
                            >
                              <SquarePen className='mr-2' size={16} />
                              Edit
                            </Link>
                            <DeleteDialog
                              projectLocation={projectLocation}
                              projectName={projectName}
                              handleDeleteProject={handleDeleteProject}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )
              ) : (
                <TableRow className='hover:bg-transparent'>
                  <TableCell colSpan={5} className='h-60 text-center'>
                    <div className='flex flex-col gap-2'>
                      <div className='self-center p-2 bg-gray-100 rounded-full'>
                        <X size={24} className='text-gray-400' />
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-xl font-medium'>No projects</span>
                        <span className='text-muted-foreground'>Create a new project</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
