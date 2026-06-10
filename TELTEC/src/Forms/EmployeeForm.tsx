import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { XIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { employeeAPI } from '../Context/AppContext';
import { hi } from 'date-fns/locale';

// Define the Employee interface
interface Employee {
  id?: number;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  hire_date?: Date;
  salary: number;
  skills: string;
  isActive?: boolean;
}

// Enhanced schema with validation
const employeeSchema = z.object({
  name: z.string()
    .min(2, 'Employee name must be at least 2 characters')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z\s\-\.]+$/, 'Name should only contain letters, spaces, hyphens, and periods'),
  position: z.string()
    .min(2, 'Position must be at least 2 characters')
    .max(100, 'Position too long'),
  department: z.string()
    .min(2, 'Department must be at least 2 characters')
    .max(100, 'Department too long'),
  email: z.string()
    .email('Invalid email format')
    .min(1, 'Email is required'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, 'Invalid phone number format'),
  status: z.enum(['Active', 'Inactive']),
  salary: z.number()
    .min(0, 'Salary cannot be negative')
    .max(1000000, 'Salary too high'),
  skills: z.string()
    .min(2, 'Skills must be at least 2 characters')
    .max(500, 'Skills description too long'),
  isActive: z.boolean(),
  hire_date: z.date().optional(),

});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  employee: Employee | null;
  onSave: (data: Employee) => void;
  onCancel: () => void;
}

export function EmployeeForm({ employee, onSave, onCancel }: EmployeeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employee ? {
      name: employee.name,
      position: employee.position,
      department: employee.department,
      email: employee.email,
      phone: employee.phone,
      status: employee.status,
      salary: employee.salary,
      skills: employee.skills,
      isActive: employee.isActive,
      //hire_date: employee.hire_date || new Date(),
    } : {
      name: '',
      position: '',
      department: '',
      email: '',
      phone: '',
      status: 'Active',
      salary: 0,
      skills: '',
      isActive: true
    },
  });

  const departments = [
    'IT',
    'HR',
    'Finance',
    'Operations',
    'Sales',
    'Marketing',
    'Customer Service',
    'Research & Development',
    'Legal',
    'Administration'
  ];

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const employeeData = {
        ...data,
        hireDate: (employee?.hire_date || new Date()).toISOString(),
      };

      if (employee?.id) {
        await employeeAPI.updateEmployee(employee.id, employeeData);
      } else {
        await employeeAPI.createEmployee(employeeData);
      }
      reset(); // Reset form fields after successful submission
      setSubmitError(null);

      onSave(employeeData);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        onCancel();
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save employee';
      setSubmitError(errorMessage);
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {submitError && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-600">{submitError}</span>
            </div>
          )}

          {submitSuccess && (
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-600">Employee saved successfully!</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter employee name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position *
            </label>
            <input
              {...register('position')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter position"
              disabled={isSubmitting}
            />
            {errors.position && (
              <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department *
            </label>
            <select
              {...register('department')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter email address"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter phone number"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary *
            </label>
            <input
              {...register('salary', { valueAsNumber: true })}
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter salary"
              disabled={isSubmitting}
            />
            {errors.salary && (
              <p className="mt-1 text-sm text-red-600">{errors.salary.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills *
            </label>
            <textarea
              {...register('skills')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter skills and qualifications"
              disabled={isSubmitting}
            />
            {errors.skills && (
              <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : employee ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
