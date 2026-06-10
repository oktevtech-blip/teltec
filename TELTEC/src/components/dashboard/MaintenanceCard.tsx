import React from 'react';
import { CalendarIcon, UserIcon, MapPinIcon } from 'lucide-react';
export function MaintenanceCard() {
  const maintenanceTasks = [{
    id: 1,
    title: 'Quarterly CCTV System Check',
    client: 'Stanbic Bank - Main Branch',
    location: 'Kampala Road',
    assignedTo: 'John Mukasa',
    scheduledDate: '2023-06-10',
    priority: 'High'
  }, {
    id: 2,
    title: 'UPS Battery Replacement',
    client: 'MTN Data Center',
    location: 'Bugolobi',
    assignedTo: 'Sarah Namuli',
    scheduledDate: '2023-06-12',
    priority: 'Medium'
  }, {
    id: 3,
    title: 'Network Infrastructure Audit',
    client: 'Ministry of Finance',
    location: 'Kampala',
    assignedTo: 'David Okello',
    scheduledDate: '2023-06-15',
    priority: 'Medium'
  }];
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Upcoming Maintenance
        </h2>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {maintenanceTasks.map(task => <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-sm font-medium text-gray-900">
                  {task.title}
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{task.client}</p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {task.scheduledDate}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <UserIcon className="h-4 w-4 mr-1" />
                  {task.assignedTo}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <MapPinIcon className="h-4 w-4 mr-1" />
                  {task.location}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 text-right">
                <button className="text-xs text-blue-600 hover:text-blue-500">
                  View details
                </button>
              </div>
            </div>)}
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 text-right">
        <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          View all maintenance tasks
        </button>
      </div>
    </div>;
}
