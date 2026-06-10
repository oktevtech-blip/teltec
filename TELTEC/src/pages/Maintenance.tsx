import { useState } from 'react';
import { useAppContext, MaintenanceTask } from '../Context/AppContext.tsx';
import { PlusIcon, EditIcon, TrashIcon, CalendarIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';
import { MaintenanceForm } from '../Forms/MaintenanceForm.tsx';
import { format,isBefore } from 'date-fns';

export function Maintenance() {
  const { state, dispatch } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<MaintenanceTask | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task: MaintenanceTask) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDeleteTask = (id: number) => {
    if (window.confirm('Are you sure you want to delete this maintenance task?')) {
      dispatch({ type: 'DELETE_MAINTENANCE_TASK', payload: id });
    }
  };

  const handleSaveTask = (taskData: Omit<MaintenanceTask, 'id'>) => {
    if (editingTask) {
      dispatch({
        type: 'UPDATE_MAINTENANCE_TASK',
        payload: { ...taskData, id: editingTask.id }
      });
    } else {
      const newId = Math.max(...state.maintenance.map(t => t.id), 0) + 1;
      dispatch({
        type: 'ADD_MAINTENANCE_TASK',
        payload: { ...taskData, id: newId }
      });
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleCompleteTask = (task: MaintenanceTask) => {
    dispatch({
      type: 'UPDATE_MAINTENANCE_TASK',
      payload: { ...task, status: 'Completed' }
    });
  };

  const types = Array.from(new Set(state.maintenance.map(task => task.type)));
  const priorities = ['Low', 'Medium', 'High', 'Critical'];

  const filteredTasks = state.maintenance.filter(task => {
    const matchesType = filter === 'all' || task.type === filter;
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSearch = searchTerm === '' ||
      task.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low':
        return 'bg-gray-100 text-gray-800';
      case 'Medium':
        return 'bg-blue-100 text-blue-800';
      case 'High':
        return 'bg-yellow-100 text-yellow-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return <CalendarIcon className="h-4 w-4" />;
      case 'In Progress':
        return <ClockIcon className="h-4 w-4" />;
      case 'Completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'Overdue':
        return <AlertTriangleIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const isTaskOverdue = (task: MaintenanceTask) => {
    const today = new Date();
    const scheduledDate = new Date(task.scheduledDate);
    return task.status !== 'Completed' && isBefore(scheduledDate, today);
  };

  const getTaskUrgency = (task: MaintenanceTask) => {
    const today = new Date();
    const scheduledDate = new Date(task.scheduledDate);
    const daysUntil = Math.ceil((scheduledDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (isTaskOverdue(task)) return 'overdue';
    if (daysUntil <= 3) return 'urgent';
    if (daysUntil <= 7) return 'upcoming';
    return 'normal';
  };

  // Statistics
  const stats = {
    total: filteredTasks.length,
    scheduled: filteredTasks.filter(t => t.status === 'Scheduled').length,
    inProgress: filteredTasks.filter(t => t.status === 'In Progress').length,
    completed: filteredTasks.filter(t => t.status === 'Completed').length,
    overdue: filteredTasks.filter(t => isTaskOverdue(t)).length,
  };

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Maintenance Management</h1>
            <p className="text-gray-600">Schedule and track equipment maintenance tasks</p>
          </div>
          <button
            onClick={handleAddTask}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Schedule Task</span>
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 rounded-md bg-blue-100">
                <CalendarIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Total Tasks</p>
                <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 rounded-md bg-yellow-100">
                <ClockIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">In Progress</p>
                <p className="text-lg font-semibold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 rounded-md bg-green-100">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Completed</p>
                <p className="text-lg font-semibold text-gray-900">{stats.completed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 rounded-md bg-gray-100">
                <CalendarIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Scheduled</p>
                <p className="text-lg font-semibold text-gray-900">{stats.scheduled}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-2 rounded-md bg-red-100">
                <AlertTriangleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-600">Overdue</p>
                <p className="text-lg font-semibold text-gray-900">{stats.overdue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Types
              </button>
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filter === type
                      ? 'bg-orange-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Status</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>

              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Scheduled Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => {
                  const urgency = getTaskUrgency(task);
                  const isOverdue = isTaskOverdue(task);

                  return (
                    <tr key={task.id} className={`hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{task.equipment}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{task.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">{task.type}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(task.scheduledDate), 'MMM dd, yyyy')}
                        </div>
                        {urgency === 'urgent' && (
                          <div className="text-xs text-orange-600 font-medium">Urgent</div>
                        )}
                        {urgency === 'overdue' && (
                          <div className="text-xs text-red-600 font-medium">Overdue</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{task.assignedTo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(isOverdue && task.status !== 'Completed' ? 'Overdue' : task.status)}`}>
                          <span className="mr-1">
                            {getStatusIcon(isOverdue && task.status !== 'Completed' ? 'Overdue' : task.status)}
                          </span>
                          {isOverdue && task.status !== 'Completed' ? 'Overdue' : task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {task.status !== 'Completed' && (
                            <button
                              onClick={() => handleCompleteTask(task)}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as completed"
                            >
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleEditTask(task)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No maintenance tasks found.</p>
            </div>
          )}
        </div>

        {/* Maintenance Form Modal */}
        {showForm && (
          <MaintenanceForm
            task={editingTask}
            onSave={handleSaveTask}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
  );
}
