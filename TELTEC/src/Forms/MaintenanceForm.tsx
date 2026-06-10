import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { XIcon } from 'lucide-react';
import { MaintenanceTask } from 'C:/Users/DELL/Desktop/Teltec Complete/TELTEC/src/Context/AppContext.tsx';

const maintenanceSchema = z.object({
  equipment: z.string().min(1, 'Equipment name is required').max(100, 'Equipment name too long'),
  type: z.enum(['Preventive', 'Corrective', 'Emergency']),
  status: z.enum(['Scheduled', 'In Progress', 'Completed', 'Overdue']),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  assignedTo: z.string().min(1, 'Assigned person is required').max(100, 'Name too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
});

type MaintenanceFormData = z.infer<typeof maintenanceSchema>;

interface MaintenanceFormProps {
  task: MaintenanceTask | null;
  onSave: (data: Omit<MaintenanceTask, 'id'>) => void;
  onCancel: () => void;
}

export function MaintenanceForm({ task, onSave, onCancel }: MaintenanceFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: task ? {
      equipment: task.equipment,
      type: task.type,
      status: task.status,
      scheduledDate: task.scheduledDate,
      assignedTo: task.assignedTo,
      description: task.description,
      priority: task.priority,
    } : {
      equipment: '',
      type: 'Preventive',
      status: 'Scheduled',
      scheduledDate: '',
      assignedTo: '',
      description: '',
      priority: 'Medium',
    },
  });

  const onSubmit = (data: MaintenanceFormData) => {
    onSave(data);
  };

  const equipmentOptions = [
    'Generator Set #1',
    'Generator Set #2',
    'HVAC System - Building A',
    'HVAC System - Building B',
    'Security Gate Motor',
    'Elevator #1',
    'Elevator #2',
    'Fire Pump',
    'Water Pump',
    'UPS System',
    'Server Room AC',
    'Emergency Lighting',
    'CCTV System',
    'Access Control System',
    'Network Infrastructure',
  ];

  const technicians = [
    'John Mukasa',
    'Sarah Namuli',
    'David Okello',
    'Mary Nakato',
    'Peter Ssali',
    'Grace Namaganda',
    'James Katamba',
    'Ruth Nambi',
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            {task ? 'Edit Maintenance Task' : 'Schedule New Maintenance Task'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Equipment *
            </label>
            <select
              {...register('equipment')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select equipment</option>
              {equipmentOptions.map((equipment) => (
                <option key={equipment} value={equipment}>
                  {equipment}
                </option>
              ))}
            </select>
            {errors.equipment && (
              <p className="text-red-500 text-sm mt-1">{errors.equipment.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                {...register('type')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Preventive">Preventive</option>
                <option value="Corrective">Corrective</option>
                <option value="Emergency">Emergency</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority *
              </label>
              <select
                {...register('priority')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
              {errors.priority && (
                <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scheduled Date *
              </label>
              <input
                {...register('scheduledDate')}
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {errors.scheduledDate && (
                <p className="text-red-500 text-sm mt-1">{errors.scheduledDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assigned To *
            </label>
            <select
              {...register('assignedTo')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select technician</option>
              {technicians.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
            {errors.assignedTo && (
              <p className="text-red-500 text-sm mt-1">{errors.assignedTo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Describe the maintenance task, procedures, and requirements..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : task ? 'Update' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
