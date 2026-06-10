import React, { useState, useEffect } from 'react';
import { useAppContext, Employee } from '../Context/AppContext';
import { PlusIcon, EditIcon, TrashIcon, PackageIcon } from 'lucide-react';
import { EmployeeForm } from '../Forms/EmployeeForm';

export function Employees() {
  const { state, dispatch } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Employee | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

   // Load employees on component mount
   useEffect(() => {
     loadEmployees();
   }, []);
 
   const loadEmployees = async () => {
     setLoading(true);
     setError('');
     try {
       const response = await fetch('/api/employees');
       if (!response.ok) {
         throw new Error(`Failed to load employees: ${response.statusText}`);
       }
       const employees = await response.json();
       dispatch({ type: 'SET_EMPLOYEES', payload: employees });
     } catch (err) {
       setError(err instanceof Error ? err.message : 'Failed to load employees');
       console.error('Error loading employees:', err);
     } finally {
       setLoading(false);
     }
   };

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
    setError('');
    setSuccessMessage('');
  };

  const handleEditItem = (item: Employee) => {
    setEditingItem(item);
    setShowForm(true);
    setError('');
    setSuccessMessage('');
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      dispatch({ type: 'DELETE_EMPLOYEE', payload: id });
    }
  };
  // const handleSaveItem = (itemData: Omit<Employee, 'id'>) => {
  //   if (editingItem) {
  //     dispatch({
  //       type: 'UPDATE_EMPLOYEE',
  //       payload: { ...itemData, id: editingItem.id }
  //     });
  //   } else {
  //     const newId = Math.max(...state.inventory.map(i => i.id), 0) + 1;
  //     dispatch({
  //       type: 'ADD_EMPLOYEE',
  //       payload: { ...itemData, id: newId }
  //     });
  //   }
  //   setShowForm(false);
  //   setEditingItem(null);
  // };

  const handleSaveItem = async (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
      setLoading(true);
      setError('');
      
      try {
        let response;
        
        if (editingItem) {
          // Update existing employee
          response = await fetch(`/api/employees/${editingItem.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData),
          });
        } else {
          // Create new employee
          response = await fetch('/api/employees', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(employeeData),
          });
        }
  
        if (!response.ok) {
          throw new Error(`Failed to save employee: ${response.statusText}`);
        }
  
        const savedEmployee = await response.json();
  
        if (editingItem) {
          dispatch({ type: 'UPDATE_EMPLOYEE', payload: savedEmployee });
          setSuccessMessage('Employee updated successfully');
        } else {
          dispatch({ type: 'ADD_EMPLOYEE', payload: savedEmployee });
          setSuccessMessage('Employee added successfully');
        }
  
        setShowForm(false);
        setEditingItem(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save employee');
        console.error('Error saving employee:', err);
      } finally {
        setLoading(false);
      }
    };

  const Departments = Array.from(new Set(state.employees.map(item => item.department)));

  const filteredItems = state.employees.filter(item => {
    const matchesCategory = filter === 'all' || item.department === filter;
    const matchesSearch = searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (department: string) => {
    const colors: { [key: string]: string } = {
      'Operations': 'bg-blue-100 text-blue-800',
      'Management': 'bg-green-100 text-green-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[department] || colors.default;
  };

  const getStockStatus = (status: 'Active' | 'Inactive') => {
    if (status === 'Inactive') return { text: 'Inactive', color: 'text-red-600' };
    return { text: 'Active', color: 'text-green-600' };
  };

  //const totalValue = filteredItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
            <p className="text-gray-600">Track and manage your Employees</p>
          </div>
          <button
            onClick={handleAddItem}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Employee</span>
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
                <PackageIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Total Employees</h2>
                <p className="text-xl font-semibold text-gray-900">{filteredItems.length}</p>
              </div>
            </div>
          </div>
          {/* <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                <DollarSignIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Total Value</h2>
                <p className="text-xl font-semibold text-gray-900">${totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div> */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                <PackageIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Departments</h2>
                <p className="text-xl font-semibold text-gray-900">{Departments.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and search */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Departments
              </button>
              {Departments.map((department) => (
                <button
                  key={department}
                  onClick={() => setFilter(department)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filter === department
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {department}
                </button>
              ))}
            </div>
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Inventory table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
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
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">Updated: {new Date(item.hireDate).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.department)}`}>
                          {item.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.Phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${stockStatus.color}`}>
                          {stockStatus.text}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
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
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No Employees found.</p>
            </div>
          )}
        </div>

        {/* Inventory Form Modal */}
        {showForm && (
          <EmployeeForm
            item={editingItem}
            onSave={handleSaveItem}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
          />
        )}
      </div>
  );
}
