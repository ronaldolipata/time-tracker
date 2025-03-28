import { useTimeTracker } from '@/context/time-tracker-context';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

export default function SelectProject() {
  const {
    isSelectProjectEnabled,
    projectData,
    selectedPayrollPeriod,
    selectedSite,
    selectedLocation,
    selectedProjectName,
    setSelectedSite,
    setSelectedLocation,
    setSelectedProjectName,
    setIsTimeEntriesEnabled,
  } = useTimeTracker();

  // Find projects based on the selected location
  const filteredProjects =
    // projectData.find((data) => data.projectSite === selectedSite)?.projects || [];
    projectData.flatMap(({ projectSite, projects }) =>
      projects.find(
        ({ projectLocation }) =>
          projectSite === selectedSite && projectLocation === selectedLocation
      )
    ) || [];

  function handleSelectedProject(site: string, location: string, project: string) {
    if (selectedPayrollPeriod && site && location && project) {
      setIsTimeEntriesEnabled(true);
    }
  }

  return (
    <Card className='col-span-2 w-full gap-5 p-5'>
      <div className='flex flex-col gap-2'>
        <CardTitle>Select Project</CardTitle>
        <CardDescription>Select to paste time entries</CardDescription>
      </div>

      <div className='flex flex-col lg:flex-row gap-4'>
        <Select
          disabled={!isSelectProjectEnabled}
          onValueChange={(value) => {
            setSelectedSite(value);
            if (selectedProjectName)
              handleSelectedProject(value, selectedLocation, selectedProjectName);
          }}
        >
          <SelectTrigger className='w-full truncate'>
            <SelectValue placeholder='Select site' />
          </SelectTrigger>
          <SelectContent>
            {projectData.length > 0 ? (
              projectData.map(({ projectSite }) => (
                <SelectItem key={projectSite} value={projectSite}>
                  {projectSite}
                </SelectItem>
              ))
            ) : (
              <div className='p-2 text-center text-sm text-muted-foreground'>
                <p>No project site available.</p>
                <p>
                  Please create{' '}
                  <Link className='!text-blue-600' href={'/projects/create'}>
                    here
                  </Link>
                  .
                </p>
              </div>
            )}
          </SelectContent>
        </Select>

        <Select
          disabled={!isSelectProjectEnabled}
          onValueChange={(value) => {
            setSelectedLocation(value);
            if (selectedProjectName)
              handleSelectedProject(selectedSite, value, selectedProjectName);
          }}
        >
          <SelectTrigger className='w-full truncate'>
            <SelectValue placeholder='Select location' />
          </SelectTrigger>
          <SelectContent>
            {projectData.length > 0 ? (
              projectData.map(({ projects }) =>
                projects.map(({ projectLocation }) => (
                  <SelectItem key={projectLocation} value={projectLocation}>
                    {projectLocation}
                  </SelectItem>
                ))
              )
            ) : (
              <div className='p-2 text-center text-sm text-muted-foreground'>
                <p>No project locations available.</p>
                <p>
                  Please create{' '}
                  <Link className='!text-blue-600' href={'/projects/create'}>
                    here
                  </Link>
                  .
                </p>
              </div>
            )}
          </SelectContent>
        </Select>

        <Select
          disabled={!isSelectProjectEnabled}
          onValueChange={(value) => {
            setSelectedProjectName(value);
            if (selectedLocation) handleSelectedProject(selectedSite, selectedLocation, value);
          }}
        >
          <SelectTrigger className='w-full truncate'>
            <SelectValue placeholder='Select name' />
          </SelectTrigger>
          <SelectContent>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <SelectItem key={projectName} value={projectName}>
                  {projectName}
                </SelectItem>
              ))
            ) : (
              <div className='p-2 text-center text-sm text-muted-foreground'>
                <p>No project names available.</p>
                <p>
                  Please create{' '}
                  <Link className='!text-blue-600' href={'/projects/create'}>
                    here
                  </Link>
                  .
                </p>
              </div>
            )}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
