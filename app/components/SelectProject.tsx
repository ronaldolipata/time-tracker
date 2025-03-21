import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTimeTracker } from '@/context/TimeTrackerContext';
import { Button } from '@/components/ui/button';

export default function SelectProject() {
  const {
    projectData,
    selectedLocation,
    selectedProject,
    setSelectedLocation,
    setSelectedProject,
    setIsPayrollPeriodEnabled,
  } = useTimeTracker();

  // Find projects based on the selected location
  const filteredProjects =
    projectData.find((data) => data.location === selectedLocation)?.projects || [];

  function handleSelectedProject() {
    setIsPayrollPeriodEnabled(true);
  }

  return (
    <Card className='w-full gap-4 p-4'>
      <div className='flex flex-col gap-2'>
        <CardTitle>Select Project</CardTitle>
        <CardDescription>Select to enter payroll period</CardDescription>
      </div>

      <div className='flex flex-col lg:flex-row gap-4'>
        <Select
          disabled={!projectData.length}
          onValueChange={(value) => setSelectedLocation(value)}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select location' />
          </SelectTrigger>
          <SelectContent>
            {projectData.map(({ location }) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select disabled={!selectedLocation} onValueChange={(value) => setSelectedProject(value)}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder={'Select project name'} />
          </SelectTrigger>
          <SelectContent>
            {filteredProjects.map(({ projectName }) => (
              <SelectItem key={projectName} value={projectName}>
                {projectName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          className='focus:bg-blue-900 hover:bg-blue-900 cursor-pointer'
          disabled={!selectedLocation || !selectedProject}
          onClick={handleSelectedProject}
        >
          Select
        </Button>
      </div>
    </Card>
  );
}
