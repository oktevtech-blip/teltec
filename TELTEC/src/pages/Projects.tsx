import { useState } from 'react';
import { useAppContext, Project } from '../Context/AppContext.tsx';
import { PlusIcon, EditIcon, TrashIcon, CalendarIcon, DollarSignIcon } from 'lucide-react';
import { ProjectForm } from '../Forms/ProjectForm.tsx';

export function Projects() {
  const { state, dispatch } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const handleAddProject = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDeleteProject = (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch({ type: 'DELETE_PROJECT', payload: id });
    }
  };

  const handleSaveProject = (projectData: Omit<Project, 'id'>) => {
    if (editingProject) {
      dispatch({
        type: 'UPDATE_PROJECT',
        payload: { ...projectData, id: editingProject.id }
      });
    } else {
      const newId = Math.max(...state.projects.map(p => p.id), 0) + 1;
      dispatch({
        type: 'ADD_PROJECT',
        payload: { ...projectData, id: newId }
      });
    }
    setShowForm(false);
    setEditingProject(null);
  };

  const filteredProjects = state.projects.filter(project => {
    if (filter === 'all') return true;
    return project.status.toLowerCase().replace(' ', '-') === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
            <p className="text-gray-600">Manage all your projects in one place</p>
          </div>
          <button
            onClick={handleAddProject}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Project</span>
          </button>
        </div>

        {/* Filter buttons */}
        <div className="flex space-x-2 mb-6">
          {['all', 'pending', 'in-progress', 'completed', 'delayed'].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {project.name}
                  </h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditProject(project)}
                      className="p-1 text-gray-500 hover:text-blue-600"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-1 text-gray-500 hover:text-red-600"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-3">{project.client}</p>

                {project.description && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}
                    >
                      {project.status}
                    </span>
                    <span className="text-sm text-gray-500">{project.progress}%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        project.status === 'Delayed'
                          ? 'bg-red-500'
                          : project.status === 'Completed'
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(project.deadline).toLocaleDateString()}
                    </div>
                    {project.budget && (
                      <div className="flex items-center">
                        <DollarSignIcon className="h-4 w-4 mr-1" />
                        ${project.budget.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found for the selected filter.</p>
          </div>
        )}

        {/* Project Form Modal */}
        {showForm && (
          <ProjectForm
            project={editingProject}
            onSave={handleSaveProject}
            onCancel={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
          />
        )}
      </div>
  );
}
