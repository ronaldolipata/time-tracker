'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTimeTracker } from '@/context/time-tracker-context';
import { CustomLink } from '@/components/custom-link';
import { DynamicBreadcrumbs } from '@/components/dynamic-breadcrumbs';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';

export default function Edit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectParam = searchParams.get('project');

  const {
    projectData,
    setProjectData,
    projectSite,
    projectLocation,
    projectStatus,
    projectName,
    setProjectSite,
    setProjectLocation,
    setProjectStatus,
    setProjectName,
  } = useTimeTracker();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projectParam && projectData) {
      const [site, location, name] = decodeURIComponent(projectParam).split('-');
      const project = projectData
        .find((siteData) => siteData.projectSite === site)
        ?.projects.find(
          (project) => project.projectLocation === location && project.projectName === name
        );

      if (project) {
        setProjectSite(site);
        setProjectLocation(location);
        setProjectName(name);
        setProjectStatus(project.projectStatus);
      } else {
        toast.error('Project not found');
        router.push('/projects');
      }
    }
    setIsLoading(false);
  }, [
    projectParam,
    projectData,
    setProjectSite,
    setProjectLocation,
    setProjectName,
    setProjectStatus,
    router,
  ]);

  function handleUpdate() {
    if (!projectSite || !projectLocation || !projectName || !projectStatus) {
      toast.error('Please fill in all required fields');
      return;
    }

    setProjectData((prevProjectData) =>
      prevProjectData.map((site) => {
        if (site.projectSite === projectSite) {
          return {
            ...site,
            projects: site.projects.map((project) => {
              if (
                project.projectLocation === projectLocation &&
                project.projectName === projectName
              ) {
                return {
                  ...project,
                  projectLocation,
                  projectName,
                  projectStatus,
                };
              }
              return project;
            }),
          };
        }
        return site;
      })
    );

    toast.success('Project updated successfully');
    router.push('/projects');
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <ToastContainer />
      <div className='flex flex-col gap-5 py-8'>
        <div className='flex flex-col gap-2'>
          <DynamicBreadcrumbs />
          <h1 className='text-3xl font-bold'>Edit Project</h1>
        </div>
        <Card className='w-full gap-0 p-0'>
          <div className='flex flex-col gap-2 border-b p-5'>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Update project site, location, and name. These will be used to separate time entries
              of the employees.
            </CardDescription>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 p-5'>
            <div className='flex flex-col gap-2'>
              <Label className='text-sm font-semibold'>
                Site <span className='text-red-600'>*</span>
              </Label>
              <Input
                type='text'
                className='w-full min-h-8 text-sm border cursor-pointer'
                placeholder='Enter the project site'
                value={projectSite}
                onChange={(e) => setProjectSite(e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label className='text-sm font-semibold'>
                Location <span className='text-red-600'>*</span>
              </Label>
              <Input
                type='text'
                className='w-full min-h-8 text-sm border cursor-pointer'
                placeholder='Enter the project location'
                value={projectLocation}
                onChange={(e) => setProjectLocation(e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label className='text-sm font-semibold'>
                Name <span className='text-red-600'>*</span>
              </Label>
              <Input
                type='text'
                className='w-full min-h-8 text-sm border cursor-pointer'
                placeholder='Enter the project name'
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label className='text-sm font-semibold'>
                Status <span className='text-red-600'>*</span>
              </Label>
              <RadioGroup
                defaultValue={projectStatus}
                className='flex'
                onValueChange={(value) => setProjectStatus(value)}
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem className='cursor-pointer' value='enabled' id='enabled' />
                  <Label className='cursor-pointer' htmlFor='enabled'>
                    Enabled
                  </Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem className='cursor-pointer' value='disabled' id='disabled' />
                  <Label className='cursor-pointer' htmlFor='disabled'>
                    Disabled
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </Card>
        <div className='flex flex-col lg:flex-row gap-2'>
          <Button
            className='cursor-pointer'
            onClick={handleUpdate}
            disabled={!projectSite || !projectLocation || !projectName || !projectStatus}
          >
            Update
          </Button>
          <CustomLink href='/projects' className='cursor-pointer' variant={'outline'}>
            Cancel
          </CustomLink>
        </div>
      </div>
    </>
  );
}
