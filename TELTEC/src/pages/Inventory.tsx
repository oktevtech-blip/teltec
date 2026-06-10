import { useState } from 'react';
import { useAppContext, InventoryItem } from '../Context/AppContext';
import { PlusIcon, EditIcon, TrashIcon, PackageIcon, DollarSignIcon } from 'lucide-react';
import { InventoryForm } from '../Forms/InventoryForm';

export function Inventory() {
  const { state, dispatch } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddItem = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDeleteItem = (id: number) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      dispatch({ type: 'DELETE_INVENTORY_ITEM', payload: id });
    }
  };

  const handleSaveItem = (itemData: Omit<InventoryItem, 'id'>) => {
    if (editingItem) {
      dispatch({
        type: 'UPDATE_INVENTORY_ITEM',
        payload: { ...itemData, id: editingItem.id }
      });
    } else {
      const newId = Math.max(...state.inventory.map(i => i.id), 0) + 1;
      dispatch({
        type: 'ADD_INVENTORY_ITEM',
        payload: { ...itemData, id: newId }
      });
    }
    setShowForm(false);
    setEditingItem(null);
  };

  const categories = Array.from(new Set(state.inventory.map(item => item.category)));

  const filteredItems = state.inventory.filter(item => {
    const matchesCategory = filter === 'all' || item.category === filter;
    const matchesSearch = searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Security': 'bg-blue-100 text-blue-800',
      'Networking': 'bg-green-100 text-green-800',
      'Energy': 'bg-yellow-100 text-yellow-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.default;
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'text-red-600' };
    if (quantity < 10) return { text: 'Low Stock', color: 'text-yellow-600' };
    return { text: 'In Stock', color: 'text-green-600' };
  };

  const totalValue = filteredItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
            <p className="text-gray-600">Track and manage your inventory items</p>
          </div>
          <button
            onClick={handleAddItem}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Item</span>
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
                <h2 className="text-sm font-medium text-gray-600">Total Items</h2>
                <p className="text-xl font-semibold text-gray-900">{filteredItems.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-green-100">
                <DollarSignIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Total Value</h2>
                <p className="text-xl font-semibold text-gray-900">${totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-md bg-yellow-100">
                <PackageIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h2 className="text-sm font-medium text-gray-600">Categories</h2>
                <p className="text-xl font-semibold text-gray-900">{categories.length}</p>
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
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filter === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="w-full md:w-64">
              <input
                type="text"
                placeholder="Search items or suppliers..."
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
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
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
                  const stockStatus = getStockStatus(item.quantity);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">Updated: {new Date(item.lastUpdated).toLocaleDateString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.quantity} {item.unit}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${item.price.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">Total: ${(item.quantity * item.price).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{item.supplier}</div>
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
              <p className="text-gray-500">No inventory items found.</p>
            </div>
          )}
        </div>

        {/* Inventory Form Modal */}
        {showForm && (
          <InventoryForm
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



// import React from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { XIcon } from 'lucide-react';
// import { InventoryItem } from '../Context/AppContext.tsx';

// const inventorySchema = z.object({
//   name: z.string().min(1, 'Item name is required').max(100),
//   category: z.string().min(1, 'Category is required'),
//   quantity: z.number().min(0, 'Quantity must be non-negative'),
//   unit: z.string().min(1, 'Unit is required'),
//   price: z.number().min(0, 'Price must be positive'),
//   supplier: z.string().min(1, 'Supplier is required').max(100),
//   last_updated: z.string().min(1, 'Last updated date is required'),
// });

// type InventoryFormData = z.infer<typeof inventorySchema>;

// interface InventoryFormProps {
//   item: InventoryItem | null;
//   onSave: (data: Omit<InventoryItem, 'id'>) => void;
//   onCancel: () => void;
// }

// export function InventoryForm({ item, onSave, onCancel }: InventoryFormProps) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<InventoryFormData>({
//     resolver: zodResolver(inventorySchema),
//     defaultValues: item
//       ? {
//           name: item.name,
//           category: item.category,
//           quantity: item.quantity,
//           unit: item.unit,
//           price: item.price,
//           supplier: item.supplier,
//           last_updated: item.lastUpdated,
//         }
//       : {
//           name: '',
//           category: '',
//           quantity: 0,
//           unit: '',
//           price: 0,
//           supplier: '',
//           last_updated: new Date().toISOString().split('T')[0],
//         },
//   });

//   const onSubmit = (data: InventoryFormData) => {
//   onSave({
//     name: data.name,
//     category: data.category,
//     quantity: data.quantity,
//     unit: data.unit,
//     price: data.price,
//     supplier: data.supplier,
//     lastUpdated: data.last_updated,   // FIX: convert to correct field name
//   });
// };


//   const categories = [
//     'Security', 'Networking', 'Energy', 'Electronics', 'Tools',
//     'Hardware', 'Software', 'Maintenance', 'Other'
//   ];

//   const units = [
//     'pieces', 'meters', 'kilograms', 'liters', 'boxes',
//     'sets', 'rolls', 'packages', 'units'
//   ];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b">
//           <h2 className="text-lg font-semibold text-gray-800">
//             {item ? 'Edit Inventory Item' : 'Add New Inventory Item'}
//           </h2>
//           <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
//             <XIcon className="h-6 w-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          
//           {/* Item Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Item Name *
//             </label>
//             <input
//               {...register('name')}
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
//               placeholder="Enter item name"
//             />
//             {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Category *
//             </label>
//             <select
//               {...register('category')}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//             >
//               <option value="">Select category</option>
//               {categories.map((c) => (
//                 <option key={c} value={c}>{c}</option>
//               ))}
//             </select>
//             {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
//           </div>

//           {/* Quantity & Unit */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Quantity *
//               </label>
//               <input
//                 {...register('quantity', { valueAsNumber: true })}
//                 type="number"
//                 min="0"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                 placeholder="0"
//               />
//               {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity.message}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Unit *
//               </label>
//               <select
//                 {...register('unit')}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               >
//                 <option value="">Select unit</option>
//                 {units.map((u) => (
//                   <option key={u} value={u}>{u}</option>
//                 ))}
//               </select>
//               {errors.unit && <p className="text-red-500 text-sm">{errors.unit.message}</p>}
//             </div>
//           </div>

//           {/* Price */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Price per Unit *
//             </label>
//             <input
//               {...register('price', { valueAsNumber: true })}
//               type="number"
//               min="0"
//               step="0.01"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               placeholder="0.00"
//             />
//             {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
//           </div>

//           {/* Supplier */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Supplier *
//             </label>
//             <input
//               {...register('supplier')}
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//               placeholder="Enter supplier"
//             />
//             {errors.supplier && <p className="text-red-500 text-sm">{errors.supplier.message}</p>}
//           </div>

//           {/* Last Updated */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Last Updated *
//             </label>
//             <input
//               {...register('last_updated')}
//               type="date"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md"
//             />
//             {errors.last_updated && <p className="text-red-500 text-sm">{errors.last_updated.message}</p>}
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//             >
//               {isSubmitting ? 'Saving...' : item ? 'Update' : 'Create'}
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// }
