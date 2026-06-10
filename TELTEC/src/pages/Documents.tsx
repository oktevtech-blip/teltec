import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2, FileText, Users, Briefcase, Package, Server, Calendar, User } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  department: 'projects' | 'employees' | 'clients' | 'inventory' | 'deployment';
  type: string;
  size: string;
  lastModified: string;
  author: string;
  status: 'active' | 'archived' | 'draft';
  tags: string[];
}

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Q4 Marketing Campaign Strategy',
    department: 'projects',
    type: 'PDF',
    size: '2.4 MB',
    lastModified: '2024-12-15',
    author: 'Sarah Johnson',
    status: 'active',
    tags: ['marketing', 'strategy', 'q4']
  },
  {
    id: '2',
    name: 'Employee Handbook 2024',
    department: 'employees',
    type: 'DOCX',
    size: '1.8 MB',
    lastModified: '2024-12-10',
    author: 'HR Department',
    status: 'active',
    tags: ['handbook', 'policies', 'hr']
  },
  {
    id: '3',
    name: 'TechCorp Client Contract',
    department: 'clients',
    type: 'PDF',
    size: '890 KB',
    lastModified: '2024-12-12',
    author: 'Legal Team',
    status: 'active',
    tags: ['contract', 'legal', 'techcorp']
  },
  {
    id: '4',
    name: 'Inventory Report - December',
    department: 'inventory',
    type: 'XLSX',
    size: '3.2 MB',
    lastModified: '2024-12-14',
    author: 'Mike Chen',
    status: 'active',
    tags: ['inventory', 'monthly', 'report']
  },
  {
    id: '5',
    name: 'Production Deployment Guide',
    department: 'deployment',
    type: 'MD',
    size: '245 KB',
    lastModified: '2024-12-13',
    author: 'DevOps Team',
    status: 'active',
    tags: ['deployment', 'guide', 'production']
  },
  {
    id: '6',
    name: 'Mobile App Redesign Project',
    department: 'projects',
    type: 'FIGMA',
    size: '15.6 MB',
    lastModified: '2024-12-11',
    author: 'Design Team',
    status: 'draft',
    tags: ['design', 'mobile', 'redesign']
  },
  {
    id: '7',
    name: 'Performance Review Template',
    department: 'employees',
    type: 'DOCX',
    size: '425 KB',
    lastModified: '2024-12-09',
    author: 'Jennifer Walsh',
    status: 'active',
    tags: ['performance', 'review', 'template']
  },
  {
    id: '8',
    name: 'Client Onboarding Checklist',
    department: 'clients',
    type: 'PDF',
    size: '1.1 MB',
    lastModified: '2024-12-08',
    author: 'Customer Success',
    status: 'active',
    tags: ['onboarding', 'checklist', 'client']
  }
];

const departmentConfig = {
  projects: { icon: Briefcase, color: 'bg-blue-100 text-blue-800', label: 'Projects' },
  employees: { icon: Users, color: 'bg-green-100 text-green-800', label: 'Employees' },
  clients: { icon: User, color: 'bg-purple-100 text-purple-800', label: 'Clients' },
  inventory: { icon: Package, color: 'bg-orange-100 text-orange-800', label: 'Inventory' },
  deployment: { icon: Server, color: 'bg-red-100 text-red-800', label: 'Deployment' }
};

const statusConfig = {
  active: 'bg-green-100 text-green-800',
  archived: 'bg-gray-100 text-gray-800',
  draft: 'bg-yellow-100 text-yellow-800'
};

export function Documents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredDocuments = useMemo(() => {
    return mockDocuments.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDepartment = selectedDepartment === 'all' || doc.department === selectedDepartment;
      const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [searchTerm, selectedDepartment, selectedStatus]);

  const departmentCounts = useMemo(() => {
    return Object.keys(departmentConfig).reduce((acc, dept) => {
      acc[dept] = mockDocuments.filter(doc => doc.department === dept).length;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const DocumentCard = ({ doc }: { doc: Document }) => {
    const DeptIcon = departmentConfig[doc.department].icon;
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${departmentConfig[doc.department].color}`}>
              <DeptIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{doc.name}</h3>
              <p className="text-sm text-gray-500">by {doc.author}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-orange-600 transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{doc.type} • {doc.size}</span>
          <span>{new Date(doc.lastModified).toLocaleDateString()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {doc.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                {tag}
              </span>
            ))}
            {doc.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{doc.tags.length - 3}
              </span>
            )}
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[doc.status]}`}>
            {doc.status}
          </span>
        </div>
      </div>
    );
  };

  const DocumentRow = ({ doc }: { doc: Document }) => {
    const DeptIcon = departmentConfig[doc.department].icon;
    
    return (
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${departmentConfig[doc.department].color}`}>
              <DeptIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{doc.name}</div>
              <div className="text-sm text-gray-500">{doc.type} • {doc.size}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${departmentConfig[doc.department].color}`}>
            {departmentConfig[doc.department].label}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-900">{doc.author}</td>
        <td className="px-6 py-4 text-sm text-gray-500">
          {new Date(doc.lastModified).toLocaleDateString()}
        </td>
        <td className="px-6 py-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[doc.status]}`}>
            {doc.status}
          </span>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-orange-600 transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
                <p className="mt-2 text-gray-600">Manage all company documents across departments</p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Upload Document
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {Object.entries(departmentConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <div key={key} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${config.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{departmentCounts[key]}</p>
                    <p className="text-gray-600 text-sm">{config.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents, authors, or tags..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {Object.entries(departmentConfig).map(([key, config]) => (
                  <option key={key} value={key}>{config.label}</option>
                ))}
              </select>
              
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                  onClick={() => setViewMode('list')}
                >
                  List
                </button>
                <button
                  className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Found {filteredDocuments.length} documents
          </div>
        </div>

        {/* Documents Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map(doc => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map(doc => (
                  <DocumentRow key={doc.id} doc={doc} />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
