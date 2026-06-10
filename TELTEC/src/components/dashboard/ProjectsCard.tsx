import React from 'react';
import { ClockIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
export function ProjectsCard() {
  const projects = [{
    id: 1,
    name: 'Hospital CCTV Installation',
    client: 'Mulago Hospital',
    status: 'In Progress',
    deadline: '2023-06-15',
    progress: 65
  }, {
    id: 2,
    name: 'Office Network Setup',
    client: 'MTN Uganda',
    status: 'Pending',
    deadline: '2023-07-01',
    progress: 20
  }, {
    id: 3,
    name: 'Security System Maintenance',
    client: 'Bank of Uganda',
    status: 'Completed',
    deadline: '2023-05-20',
    progress: 100
  }, {
    id: 4,
    name: 'Solar Panel Installation',
    client: 'Kampala City Council',
    status: 'Delayed',
    deadline: '2023-05-30',
    progress: 45
  }];
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
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'In Progress':
        return <ClockIcon className="h-4 w-4" />;
      case 'Pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'Completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'Delayed':
        return <AlertCircleIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };
  return <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">Recent Projects</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Project
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.map(project => <tr key={project.id}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {project.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Due {project.deadline}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{project.client}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    <span className="mr-1">
                      {getStatusIcon(project.status)}
                    </span>
                    {project.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${project.status === 'Delayed' ? 'bg-red-500' : project.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`} style={{
                  width: `${project.progress}%`
                }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {project.progress}%
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-4 py-3 text-right">
        <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          View all projects
        </button>
      </div>
    </div>;
}
