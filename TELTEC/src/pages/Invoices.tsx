import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2, Plus, Calendar, DollarSign, FileText, AlertCircle } from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  dueDate: string;
  issueDate: string;
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
}

export function Invoices(){
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('dueDate');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customerName: '',
    customerEmail: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, rate: 0 }]
  });

  // Mock invoice data
  const [invoices] = useState<Invoice[]>([
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      customerName: 'Acme Corporation',
      customerEmail: 'billing@acme.com',
      amount: 2500.00,
      status: 'paid',
      dueDate: '2024-01-15',
      issueDate: '2024-01-01',
      items: [
        { description: 'Website Development', quantity: 1, rate: 2000, amount: 2000 },
        { description: 'Domain Registration', quantity: 1, rate: 500, amount: 500 }
      ]
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      customerName: 'Tech Solutions Ltd',
      customerEmail: 'accounts@techsolutions.com',
      amount: 1800.00,
      status: 'pending',
      dueDate: '2024-02-01',
      issueDate: '2024-01-15',
      items: [
        { description: 'Mobile App Development', quantity: 1, rate: 1800, amount: 1800 }
      ]
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      customerName: 'Digital Marketing Co',
      customerEmail: 'finance@digitalmarketing.com',
      amount: 3200.00,
      status: 'overdue',
      dueDate: '2024-01-20',
      issueDate: '2024-01-05',
      items: [
        { description: 'SEO Optimization', quantity: 1, rate: 1600, amount: 1600 },
        { description: 'Content Management', quantity: 1, rate: 1600, amount: 1600 }
      ]
    },
    {
      id: '4',
      invoiceNumber: 'INV-2024-004',
      customerName: 'StartUp Ventures',
      customerEmail: 'billing@startupventures.com',
      amount: 950.00,
      status: 'draft',
      dueDate: '2024-02-15',
      issueDate: '2024-02-01',
      items: [
        { description: 'Logo Design', quantity: 1, rate: 950, amount: 950 }
      ]
    }
  ]);

  const filteredAndSortedInvoices = useMemo(() => {
    let filtered = invoices.filter(invoice => {
      const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'customer':
          return a.customerName.localeCompare(b.customerName);
        case 'dueDate':
        default:
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });
  }, [invoices, searchTerm, statusFilter, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <DollarSign className="w-4 h-4" />;
      case 'pending': return <Calendar className="w-4 h-4" />;
      case 'overdue': return <AlertCircle className="w-4 h-4" />;
      case 'draft': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const totalAmount = filteredAndSortedInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidAmount = filteredAndSortedInvoices.filter(inv => inv.status === 'paid').reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingAmount = filteredAndSortedInvoices.filter(inv => inv.status === 'pending').reduce((sum, invoice) => sum + invoice.amount, 0);
  const overdueAmount = filteredAndSortedInvoices.filter(inv => inv.status === 'overdue').reduce((sum, invoice) => sum + invoice.amount, 0);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowModal(true);
  };

  const handleAddItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0 }]
    }));
  };

  const handleRemoveItem = (index: number) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotal = () => {
    return newInvoice.items.reduce((total, item) => total + (item.quantity * item.rate), 0);
  };

  const handleCreateInvoice = () => {
    // Here you would typically send the invoice data to your backend
    console.log('Creating invoice:', {
      ...newInvoice,
      total: calculateTotal()
    });
    
    // Reset form and close modal
    setNewInvoice({
      customerName: '',
      customerEmail: '',
      dueDate: '',
      items: [{ description: '', quantity: 1, rate: 0 }]
    });
    setShowNewInvoiceForm(false);
    
    // You could also add the new invoice to the invoices state here
    alert('Invoice created successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
              <p className="text-gray-600 mt-1">Manage and track all your invoices</p>
            </div>
            <button 
              onClick={() => setShowNewInvoiceForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Invoice
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Paid</p>
                  <p className="text-2xl font-bold text-green-600">${paidAmount.toLocaleString()}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">${overdueAmount.toLocaleString()}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="draft">Draft</option>
              </select>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="dueDate">Sort by Due Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="customer">Sort by Customer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">Issued: {new Date(invoice.issueDate).toLocaleDateString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.customerName}</div>
                        <div className="text-sm text-gray-500">{invoice.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${invoice.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 ${getStatusColor(invoice.status)}`}>
                        {getStatusIcon(invoice.status)}
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewInvoice(invoice)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 p-1 rounded transition-colors" title="Edit Invoice">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-purple-600 hover:text-purple-900 p-1 rounded transition-colors" title="Download PDF">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900 p-1 rounded transition-colors" title="Delete Invoice">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Invoice Form Modal */}
        {showNewInvoiceForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Create New Invoice</h3>
                  <button
                    onClick={() => setShowNewInvoiceForm(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleCreateInvoice(); }}>
                  {/* Customer Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newInvoice.customerName}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, customerName: e.target.value }))}
                        placeholder="Enter customer name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Email *
                      </label>
                      <input
                        type="email"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newInvoice.customerEmail}
                        onChange={(e) => setNewInvoice(prev => ({ ...prev, customerEmail: e.target.value }))}
                        placeholder="customer@example.com"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      required
                      className="w-full md:w-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>

                  {/* Invoice Items */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-medium text-gray-900">Invoice Items</h4>
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Add Item
                      </button>
                    </div>

                    <div className="space-y-4">
                      {newInvoice.items.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                              </label>
                              <input
                                type="text"
                                required
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={item.description}
                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                placeholder="Item description"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quantity *
                              </label>
                              <input
                                type="number"
                                required
                                min="1"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rate ($) *
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  required
                                  min="0"
                                  step="0.01"
                                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  value={item.rate}
                                  onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                                />
                                {newInvoice.items.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(index)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                    title="Remove item"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-right">
                            <span className="text-sm font-medium text-gray-700">
                              Amount: ${(item.quantity * item.rate).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowNewInvoiceForm(false)}
                      className="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Create Invoice
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Detail Modal */}
        {showModal && selectedInvoice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedInvoice.invoiceNumber}</h3>
                    <p className="text-gray-600">Invoice Details</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Customer Information</h4>
                    <p className="text-gray-700">{selectedInvoice.customerName}</p>
                    <p className="text-gray-600">{selectedInvoice.customerEmail}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Invoice Information</h4>
                    <p className="text-gray-700">Issue Date: {new Date(selectedInvoice.issueDate).toLocaleDateString()}</p>
                    <p className="text-gray-700">Due Date: {new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium gap-1 mt-2 ${getStatusColor(selectedInvoice.status)}`}>
                      {getStatusIcon(selectedInvoice.status)}
                      {selectedInvoice.status.charAt(0).toUpperCase() + selectedInvoice.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-4">Items</h4>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedInvoice.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{item.quantity}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">${item.rate.toLocaleString()}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">${item.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                    <span className="text-2xl font-bold text-gray-900">${selectedInvoice.amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
