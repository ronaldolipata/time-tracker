import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, SquarePen, Trash, ArrowUpDown, X } from 'lucide-react';
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
import DeleteDialog from './delete-dialog';
import NoTableRecord from '@/components/no-table-record';
import { useTimeTracker } from '@/context/time-tracker-context';
import { ProjectData } from '@/context/types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type SortDirection = 'asc' | 'desc' | null;
type SortField = 'site' | 'location' | 'name' | null;

export default function ProjectsTable() {
  const { projectData, setProjectData } = useTimeTracker();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // State for selected projects - using a properly typed state
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  // Function to handle sorting
  const handleSort = (field: SortField) => {
    // If clicking on the same field, cycle through: asc -> desc -> null
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      // If clicking on a new field, start with ascending sort
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Process and filter project data based on search and sorting
  const processedProjectData = useMemo(() => {
    if (!projectData || projectData.length === 0) return [];

    // First, flatten the project data for easier processing
    const flattenedProjects = projectData.flatMap((site) =>
      site.projects.map((project) => ({
        projectSite: site.projectSite,
        projectLocation: project.projectLocation,
        projectName: project.projectName,
        projectStatus: project.projectStatus,
        employeeData: project.employeeData,
        id: `${site.projectSite}-${project.projectLocation}-${project.projectName}`,
      }))
    );

    // Filter by search term
    const filteredProjects = searchTerm
      ? flattenedProjects.filter(
          (project) =>
            project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.projectSite.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.projectLocation.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : flattenedProjects;

    // Sort by selected field and direction
    if (sortField && sortDirection) {
      filteredProjects.sort((a, b) => {
        let comparison = 0;

        if (sortField === 'site') {
          comparison = a.projectSite.localeCompare(b.projectSite);
        } else if (sortField === 'location') {
          comparison = a.projectLocation.localeCompare(b.projectLocation);
        } else if (sortField === 'name') {
          comparison = a.projectName.localeCompare(b.projectName);
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    // Group back by site and location for rendering
    const groupedProjects: ProjectData = [];

    filteredProjects.forEach((project) => {
      const siteIndex = groupedProjects.findIndex(
        (site) => site.projectSite === project.projectSite
      );

      if (siteIndex === -1) {
        groupedProjects.push({
          projectSite: project.projectSite,
          projects: [
            {
              projectLocation: project.projectLocation,
              projectName: project.projectName,
              projectStatus: project.projectStatus,
              employeeData: project.employeeData,
            },
          ],
        });
      } else {
        const locationIndex = groupedProjects[siteIndex].projects.findIndex(
          (p) => p.projectLocation === project.projectLocation
        );

        if (locationIndex === -1) {
          groupedProjects[siteIndex].projects.push({
            projectLocation: project.projectLocation,
            projectName: project.projectName,
            projectStatus: project.projectStatus,
            employeeData: project.employeeData,
          });
        }
      }
    });

    return groupedProjects;
  }, [projectData, searchTerm, sortField, sortDirection]);

  // Calculate total number of filtered projects and whether records were found
  const totalFilteredProjects = useMemo(
    () => processedProjectData.reduce((sum, site) => sum + site.projects.length, 0),
    [processedProjectData]
  );

  // Determine if records are found based on search and data
  const isRecordsFound = totalFilteredProjects > 0;

  // Reset selected projects when search term changes
  useEffect(() => {
    setSelectedProjects([]);
  }, [searchTerm]);

  // Function to clear search term
  const clearSearch = () => {
    setSearchTerm('');
  };

  // Function to handle individual checkbox selection
  function handleSelectProject(projectId: string): void {
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  }

  function handleSelectAll(): void {
    if (processedProjectData && processedProjectData.length > 0) {
      const allProjectIds = processedProjectData.flatMap((site) =>
        site.projects.map(
          (project) => `${site.projectSite}-${project.projectLocation}-${project.projectName}`
        )
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
            .map((site) => ({
              ...site,
              projects: site.projects.filter(
                (project) =>
                  !selectedProjects.includes(
                    `${site.projectSite}-${project.projectLocation}-${project.projectName}`
                  )
              ),
            }))
            .filter((site) => site.projects.length > 0) // Remove empty project sites
      );

      toast.success('Bulk deletion has been successful');
      setSelectedProjects([]);
    }
  }

  function handleDeleteProject(
    projectSite: string,
    projectLocation: string,
    projectName: string
  ): void {
    if (!projectData) return;

    const updatedProjectData = projectData
      .map((site) => {
        if (site.projectSite === projectSite) {
          return {
            ...site,
            projects: site.projects.filter(
              (project) =>
                !(
                  project.projectLocation === projectLocation && project.projectName === projectName
                )
            ),
          };
        }
        return site;
      })
      .filter((site) => site.projects.length > 0);

    setProjectData(updatedProjectData);
    toast.success('Project has been successfully deleted');
  }

  // Memoize this calculation to avoid recalculating on every render
  const isAllSelected =
    totalFilteredProjects > 0 && selectedProjects.length === totalFilteredProjects;

  // Helper function to get sort icon state
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return 'text-gray-400';
    return sortDirection === 'asc' ? 'text-blue-600 rotate-0' : 'text-blue-600 rotate-180';
  };

  return (
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
              Delete selected
            </Button>
          )}
        </div>
        <div className='relative'>
          <div className='relative'>
            <Search className='h-full w-5 absolute left-0 ml-2 opacity-40' />
            <div className='flex'>
              <Input
                type='text'
                className='min-h-8 pl-8 pr-8 text-sm border cursor-pointer'
                placeholder='Search project'
                aria-label='Search projects'
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
          {selectedProjects.length > 0 && (
            <span className='font-medium' aria-live='polite'>
              {selectedProjects.length} project(s) selected
            </span>
          )}
          {searchTerm && (
            <span className='font-medium ml-2' aria-live='polite'>
              {totalFilteredProjects} project(s) found
            </span>
          )}
        </div>
        <div className='flex gap-3'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleSelectAll}
            className='text-sm cursor-pointer'
            aria-label={`Select all ${totalFilteredProjects} projects`}
            disabled={totalFilteredProjects === 0}
          >
            Select all {totalFilteredProjects}
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleDeselectAll}
            className='text-sm cursor-pointer'
            disabled={selectedProjects.length === 0}
            aria-label='Deselect all projects'
          >
            Deselect all
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className='bg-muted/50 border-t'>
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
                aria-label={isAllSelected ? 'Deselect all projects' : 'Select all projects'}
                disabled={totalFilteredProjects === 0}
              />
            </TableHead>
            <TableHead className='py-4 px-3'>
              <div
                className='flex items-center cursor-pointer'
                onClick={() => handleSort('site')}
                role='button'
                tabIndex={0}
                aria-label={`Sort by site ${
                  sortField === 'site' && sortDirection === 'asc' ? 'descending' : 'ascending'
                }`}
              >
                Site
                <ArrowUpDown
                  size={16}
                  className={`ml-1 transition-transform ${getSortIcon('site')}`}
                />
              </div>
            </TableHead>
            <TableHead className='py-4 px-3'>
              <div
                className='flex items-center cursor-pointer'
                onClick={() => handleSort('location')}
                role='button'
                tabIndex={0}
                aria-label={`Sort by location ${
                  sortField === 'location' && sortDirection === 'asc' ? 'descending' : 'ascending'
                }`}
              >
                Location
                <ArrowUpDown
                  size={16}
                  className={`ml-1 transition-transform ${getSortIcon('location')}`}
                />
              </div>
            </TableHead>
            <TableHead className='py-4 px-3'>
              <div
                className='flex items-center cursor-pointer'
                onClick={() => handleSort('name')}
                role='button'
                tabIndex={0}
                aria-label={`Sort by name ${
                  sortField === 'name' && sortDirection === 'asc' ? 'descending' : 'ascending'
                }`}
              >
                Name
                <ArrowUpDown
                  size={16}
                  className={`ml-1 transition-transform ${getSortIcon('name')}`}
                />
              </div>
            </TableHead>
            <TableHead className='py-4 px-3'>Status</TableHead>
            <TableHead className='py-4 px-3 text-center'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isRecordsFound ? (
            processedProjectData.flatMap(({ projectSite, projects }) =>
              projects.map(({ projectStatus, projectName, projectLocation }, subIndex) => {
                const projectId = `${projectSite}-${projectLocation}-${projectName}`;
                return (
                  <TableRow key={projectId} className={subIndex % 2 === 0 ? '' : 'bg-muted/50'}>
                    <TableCell className='py-4 px-3 w-12'>
                      <Checkbox
                        id={`project-checkbox-${projectId}`}
                        checked={selectedProjects.includes(projectId)}
                        onCheckedChange={() => handleSelectProject(projectId)}
                        aria-label={`Select ${projectName} project`}
                      />
                    </TableCell>
                    <TableCell className='py-4 px-3'>{projectSite}</TableCell>
                    <TableCell className='py-4 px-3'>{projectLocation}</TableCell>
                    <TableCell className='py-4 px-3'>{projectName}</TableCell>
                    <TableCell className='first-letter:uppercase py-4 px-3'>
                      <span
                        className={`px-3 py-[3px] rounded-full ${
                          projectStatus === 'enabled'
                            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300'
                        }`}
                      >
                        {projectStatus}
                      </span>
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
                          projectSite={projectSite}
                          projectLocation={projectLocation}
                          projectName={projectName}
                          onDelete={handleDeleteProject}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )
          ) : (
            <NoTableRecord
              title={searchTerm ? 'No matching projects' : 'No projects'}
              description={{
                message: searchTerm ? 'Try searching different name' : 'Create a new project',
                messageLink: searchTerm
                  ? {
                      linkText: '',
                      href: '',
                    }
                  : {
                      linkText: 'here',
                      href: '/projects/create',
                    },
              }}
            />
          )}
        </TableBody>
      </Table>
    </div>
  );
}
