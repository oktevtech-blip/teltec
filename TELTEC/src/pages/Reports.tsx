import { useState } from 'react';
import { useAppContext } from '../Context/AppContext';
import { DownloadIcon, TrendingUpIcon, BarChart3Icon, PieChartIcon, CalendarIcon } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { format, subMonths, eachMonthOfInterval, isSameMonth } from 'date-fns';
import { ExportService } from '../services/ExportServices';

export function Reports() {
  const { state } = useAppContext();
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const handleExportPDF = async () => {
    await ExportService.exportToPDF('reports', 'dashboard-report.pdf');
  };

  const handleExportCSV = () => {
    ExportService.exportToCSV(state.projects, 'projects-report.csv');
  };

  // Project Status Data
  const projectStatusData = [
    { name: 'In Progress', value: state.projects.filter(p => p.status === 'In Progress').length, color: '#3B82F6' },
    { name: 'Pending', value: state.projects.filter(p => p.status === 'Pending').length, color: '#EAB308' },
    { name: 'Completed', value: state.projects.filter(p => p.status === 'Completed').length, color: '#22C55E' },
    { name: 'Delayed', value: state.projects.filter(p => p.status === 'Delayed').length, color: '#EF4444' },
  ];

  // Inventory Categories Data
  const inventoryData = state.inventory.reduce((acc: any[], item) => {
    const existingCategory = acc.find(cat => cat.category === item.category);
    if (existingCategory) {
      existingCategory.quantity += item.quantity;
      existingCategory.value += item.quantity * item.price;
    } else {
      acc.push({
        category: item.category,
        quantity: item.quantity,
        value: item.quantity * item.price,
        items: 1
      });
    }
    return acc;
  }, []);

  // Maintenance Priority Data
  const maintenanceData = [
    { priority: 'Low', count: state.maintenance.filter(m => m.priority === 'Low').length },
    { priority: 'Medium', count: state.maintenance.filter(m => m.priority === 'Medium').length },
    { priority: 'High', count: state.maintenance.filter(m => m.priority === 'High').length },
    { priority: 'Critical', count: state.maintenance.filter(m => m.priority === 'Critical').length },
  ];

  // Project Timeline Data (Last 6 months)
  const last6Months = eachMonthOfInterval({
    start: subMonths(new Date(), 5),
    end: new Date()
  });

  const projectTimelineData = last6Months.map(month => {
    const monthProjects = state.projects.filter(project =>
      isSameMonth(new Date(project.deadline), month)
    );
    return {
      month: format(month, 'MMM yyyy'),
      scheduled: monthProjects.length,
      completed: monthProjects.filter(p => p.status === 'Completed').length,
      delayed: monthProjects.filter(p => p.status === 'Delayed').length,
    };
  });

  // Financial Overview
  const totalProjectValue = state.projects.reduce((sum, project) => sum + (project.budget || 0), 0);
  const completedProjectValue = state.projects
    .filter(p => p.status === 'Completed')
    .reduce((sum, project) => sum + (project.budget || 0), 0);
  const totalInventoryValue = state.inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  // Key Metrics
  const metrics = {
    totalProjects: state.projects.length,
    activeProjects: state.projects.filter(p => p.status !== 'Completed').length,
    completionRate: Math.round((state.projects.filter(p => p.status === 'Completed').length / state.projects.length) * 100),
    overdueMaintenanceTasks: state.maintenance.filter(m => {
      const today = new Date();
      const scheduledDate = new Date(m.scheduledDate);
      return m.status !== 'Completed' && scheduledDate < today;
    }).length,
    lowStockItems: state.inventory.filter(item => item.quantity < 10).length,
    totalRevenue: completedProjectValue,
  };

  return (
      <div id="reports">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive business insights and performance metrics</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <DownloadIcon className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <DownloadIcon className="h-4 w-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                <BarChart3Icon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.activeProjects}</p>
                <p className="text-xs text-gray-500">of {metrics.totalProjects} total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                <TrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.completionRate}%</p>
                <p className="text-xs text-green-600">+5% from last month</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                <CalendarIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.overdueMaintenanceTasks}</p>
                <p className="text-xs text-yellow-600">Needs attention</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-purple-100">
                <PieChartIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.lowStockItems}</p>
                <p className="text-xs text-red-600">Requires restocking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Project Status Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projectStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Maintenance Priority Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Maintenance Tasks by Priority</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={maintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="priority" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Full Width Charts */}
        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Project Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Project Timeline (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={projectTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="scheduled" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="#22C55E" fill="#22C55E" fillOpacity={0.6} />
                <Area type="monotone" dataKey="delayed" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Inventory Value by Category */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventory Value by Category</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip formatter={(value, name) => [
                  name === 'value' ? `$${value.toLocaleString()}` : value,
                  name === 'value' ? 'Total Value' : 'Quantity'
                ]} />
                <Legend />
                <Bar yAxisId="left" dataKey="quantity" fill="#10B981" name="Quantity" />
                <Bar yAxisId="right" dataKey="value" fill="#6366F1" name="Value ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Financial Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Project Value</p>
              <p className="text-2xl font-bold text-blue-600">${totalProjectValue.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Completed Project Revenue</p>
              <p className="text-2xl font-bold text-green-600">${completedProjectValue.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Inventory Asset Value</p>
              <p className="text-2xl font-bold text-purple-600">${totalInventoryValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
  );
}
