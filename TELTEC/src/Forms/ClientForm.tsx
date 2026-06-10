import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientAPI } from '../Context/AppContext';
import { z } from 'zod';
import { XIcon, AlertCircle, CheckCircle } from 'lucide-react';

// Define the Client interface to match your backend
interface Client {
  id?: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  company_type: string;
  status: 'Active' | 'Inactive';
  registration_date?: Date;
  // created_at?: Date;
  // updated_at?: Date;
  isActive?: boolean;
}

// Enhanced schema with better validation
const clientSchema = z.object({
  name: z.string()
    .min(2, 'Client name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s\-\.]+$/, 'Name should only contain letters, spaces, hyphens, and periods'),
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Invalid phone number format'),
  address: z.string()
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address too long'),
  company_type: z.string()
    .min(2, 'Company type must be at least 2 characters')
    .max(100, 'Company type too long'),
  status: z.enum(['Active', 'Inactive']),
  isActive: z.boolean()
});

type ClientFormData = z.infer<typeof clientSchema>;

interface ClientFormProps {
  client: Client | null;
  onSave: (data: Client) => void;
  onCancel: () => void;
}

export function ClientForm({ client, onSave, onCancel }: ClientFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: client ? {
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      company_type: client.company_type,
      status: client.status,
      //isActive: client.isActive,
      //registration_date: client.registration_date || new Date(), 
    } : {
      name: '',
      email: '',
      phone: '',
      address: '',
      company_type: '',
      status: 'Active',
      isActive: true
    },
  });

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const clientData = {
        ...data,
        registration_date: client?.registration_date || new Date(),
      };

      if (client?.id) {
        await clientAPI.updateClient(client.id, clientData);
      } else {
        await clientAPI.createClient(clientData);
      }

      setSubmitSuccess(true);
      onSave(clientData);
      
      setTimeout(() => {
        onCancel();
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save client';
      setSubmitError(errorMessage);
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Company types for Uganda context
  const companyTypes = [
    'Banking & Financial Services',
    'Telecommunications',
    'Government Agency',
    'Educational Institution',
    'Healthcare',
    'Manufacturing',
    'Agriculture',
    'Technology',
    'Retail & Commerce',
    'Construction',
    'Transportation',
    'Energy & Utilities',
    'NGO/Non-Profit',
    'Other',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {client ? 'Edit Client' : 'Add New Client'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Error/Success Messages */}
          {submitError && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 text-sm">{submitError}</p>
            </div>
          )}

          {submitSuccess && (
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700 text-sm">
                Client {client ? 'updated' : 'created'} successfully!
              </p>
            </div>
          )}

          {/* Client Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Name *
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter client name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter email address"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., +256 700 123 456"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Company Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Type *
            </label>
            <select
              {...register('company_type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="">Select company type</option>
              {companyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.company_type && (
              <p className="text-red-500 text-sm mt-1">{errors.company_type.message}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <textarea
              {...register('address')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter full address"
              disabled={isSubmitting}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status *
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || submitSuccess}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : submitSuccess ? (
                'Saved!'
              ) : (
                client ? 'Update Client' : 'Create Client'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}