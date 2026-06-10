import React, { useState } from 'react';

interface InvoiceFormProps {
  invoice: Invoice | null;
  clients: Array<{ id: number; name: string }>;
  projects: Array<{ id: number; name: string }>;
  onSave: (data: Omit<Invoice, 'id'>) => void;
  onCancel: () => void;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  clientId: number;
  clientName: string;
  projectId?: number;
  projectName?: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: string;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: Array<{
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, clients, projects, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Invoice, 'id'>>({
    invoiceNumber: invoice?.invoiceNumber || '',
    clientId: invoice?.clientId || 0,
    clientName: invoice?.clientName || '',
    projectId: invoice?.projectId,
    projectName: invoice?.projectName || '',
    amount: invoice?.amount || 0,
    tax: invoice?.tax || 0,
    totalAmount: invoice?.totalAmount || 0,
    status: invoice?.status || 'Draft',
    issueDate: invoice?.issueDate || new Date().toISOString().split('T')[0],
    dueDate: invoice?.dueDate || '',
    paidDate: invoice?.paidDate || '',
    items: invoice?.items || [{ id: 1, description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleClientChange = (clientId: number) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setFormData((prev) => ({
        ...prev,
        clientId,
        clientName: client.name,
      }));
    }
  };

  const handleAmountChange = (amount: number) => {
    const tax = amount * 0.18;
    const totalAmount = amount + tax;
    setFormData((prev) => ({ ...prev, amount, tax, totalAmount }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {invoice ? 'Edit Invoice' : 'Create New Invoice'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client *
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => handleClientChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">Select client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date *
              </label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, issueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Draft">Draft</option>
                <option value="Sent">Sent</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm mb-2">
              <span>Amount:</span>
              <span>${formData.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Tax (18%):</span>
              <span>${formData.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${formData.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {invoice ? 'Update' : 'Create'} Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
