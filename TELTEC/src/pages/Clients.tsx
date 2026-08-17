import React, { useState, useEffect } from 'react';
import { useAppContext, Client } from '../Context/AppContext';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  BuildingIcon,
  UsersIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  SearchIcon,
  FilterIcon,
  RefreshCwIcon,
  AlertCircleIcon,
  CheckCircleIcon
} from 'lucide-react';
import { ClientForm } from '../Forms/ClientForm';

export function Clients() {
  const { state, clientActions } = useAppContext();

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Client | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Make sure clients is always an array
  const clients = Array.isArray(state.clients) ? state.clients : [];

  // Load clients on component mount
  useEffect(() => {
    const loadInitialClients = async () => {
      setLoading(true);
      setError('');

      try {
        await clientActions.loadClients();
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to load clients';

        setError(message);
        console.error('Error loading clients:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialClients();
  }, []);

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
    setError('');
    setSuccessMessage('');
  };

  const handleEditItem = (item: Client) => {
    setEditingItem(item);
    setShowForm(true);
    setError('');
    setSuccessMessage('');
  };

  const handleDeleteItem = async (id: number) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this client? This action cannot be undone.'
      )
    ) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await clientActions.deleteClient(id);

      setSuccessMessage('Client deleted successfully');

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to delete client';

      setError(message);
      console.error('Error deleting client:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async (
    itemData: Omit<Client, 'id' | 'created_at' | 'updated_at'>
  ) => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      if (editingItem) {
        // Update existing client
        await clientActions.updateClient(
          editingItem.id,
          itemData
        );

        setSuccessMessage('Client updated successfully');
      } else {
        // Create new client
        await clientActions.createClient(itemData);

        setSuccessMessage('Client added successfully');
      }

      setShowForm(false);
      setEditingItem(null);

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to save client';

      setError(message);
      console.error('Error saving client:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError('');

    try {
      await clientActions.loadClients();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to refresh clients';

      setError(message);
      console.error('Error refreshing clients:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique company types for filtering
  const companyTypes = Array.from(
    new Set(
      clients
        .map((client) => client.company_type)
        .filter((type): type is string => type != null)
    )
  );

  // Filter clients based on search term and category
  const filteredItems = clients.filter((client) => {
    const matchesCategory =
      filter === 'all' ||
      client.company_type === filter;

    const matchesSearch =
      searchTerm === '' ||
      client.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      client.email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      client.phone
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      client.address
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      client.company_type
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      client.id?.toString().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (companyType: string) => {
    const colors: { [key: string]: string } = {
      Technology: 'bg-blue-100 text-blue-800',
      Healthcare: 'bg-green-100 text-green-800',
      Finance: 'bg-yellow-100 text-yellow-800',
      Manufacturing: 'bg-purple-100 text-purple-800',
      Retail: 'bg-pink-100 text-pink-800',
      Education: 'bg-indigo-100 text-indigo-800',
      Government: 'bg-gray-100 text-gray-800',
      'Non-Profit': 'bg-orange-100 text-orange-800',
      default: 'bg-gray-100 text-gray-800'
    };

    return colors[companyType] || colors.default;
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? {
          text: 'Active',
          color: 'text-green-600',
          bg: 'bg-green-100'
        }
      : {
          text: 'Inactive',
          color: 'text-red-600',
          bg: 'bg-red-100'
        };
  };

  // Calculate summary statistics
  const activeClients = filteredItems.filter(
    (client) => client.isActive !== false
  ).length;

  const inactiveClients = filteredItems.filter(
    (client) => client.isActive === false
  ).length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Client Management
          </h1>

          <p className="text-gray-600">
            Manage your client relationships and contacts
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <RefreshCwIcon
              className={`h-4 w-4 ${
                loading ? 'animate-spin' : ''
              }`}
            />

            <span>Refresh</span>
          </button>

          <button
            onClick={handleAddItem}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
          <AlertCircleIcon className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-blue-100">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>

            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Total Clients
              </h2>

              <p className="text-xl font-semibold text-gray-900">
                {filteredItems.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>

            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Active Clients
              </h2>

              <p className="text-xl font-semibold text-gray-900">
                {activeClients}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-red-100">
              <AlertCircleIcon className="h-6 w-6 text-red-600" />
            </div>

            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Inactive Clients
              </h2>

              <p className="text-xl font-semibold text-gray-900">
                {inactiveClients}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
              <BuildingIcon className="h-6 w-6 text-yellow-600" />
            </div>

            <div className="ml-4">
              <h2 className="text-sm font-medium text-gray-600">
                Company Types
              </h2>

              <p className="text-xl font-semibold text-gray-900">
                {companyTypes.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FilterIcon className="h-3 w-3" />
              <span>All Types</span>
            </button>

            {companyTypes.map((companyType) => (
              <button
                key={companyType}
                onClick={() => setFilter(companyType)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === companyType
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {companyType}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-64">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <RefreshCwIcon className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />

          <p className="text-gray-500">
            Loading clients...
          </p>
        </div>
      )}

      {/* Clients Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client Details
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company Type
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
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
                {filteredItems.map((client) => {
                  const statusInfo = getStatusColor(
                    client.isActive ?? true
                  );

                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {client.name}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            client.company_type
                          )}`}
                        >
                          {client.company_type}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <PhoneIcon className="h-3 w-3 mr-1 text-gray-400" />
                            {client.phone}
                          </div>

                          <div className="flex items-center text-sm text-gray-900">
                            <MailIcon className="h-3 w-3 mr-1 text-gray-400" />
                            {client.email}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-start text-sm text-gray-900">
                          <MapPinIcon className="h-3 w-3 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />

                          <span className="max-w-xs break-words">
                            {client.address}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}
                        >
                          {statusInfo.text}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() =>
                              handleEditItem(client)
                            }
                            disabled={loading}
                            className="text-blue-600 hover:text-blue-900 disabled:text-blue-300"
                            title="Edit client"
                          >
                            <EditIcon className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteItem(client.id)
                            }
                            disabled={loading}
                            className="text-red-600 hover:text-red-900 disabled:text-red-300"
                            title="Delete client"
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

          {/* Empty State */}
          {filteredItems.length === 0 && !loading && (
            <div className="text-center py-12">
              <UsersIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />

              <p className="text-gray-500 text-lg mb-2">
                No clients found
              </p>

              <p className="text-gray-400 text-sm">
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding your first client'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Client Form Modal */}
      {showForm && (
        <ClientForm
          client={editingItem}
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