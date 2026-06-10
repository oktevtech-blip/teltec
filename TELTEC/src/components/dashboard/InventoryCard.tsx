import React from 'react';
import { AlertTriangleIcon } from 'lucide-react';
export function InventoryCard() {
  const inventoryItems = [{
    id: 1,
    name: 'CCTV Camera - Hikvision DS-2CD2T45G0P-I',
    category: 'Security',
    inStock: 12,
    threshold: 5,
    status: 'Normal'
  }, {
    id: 2,
    name: 'Network Cable CAT6 (305m)',
    category: 'Networking',
    inStock: 3,
    threshold: 5,
    status: 'Low'
  }, {
    id: 3,
    name: 'Solar Panel 300W',
    category: 'Power',
    inStock: 8,
    threshold: 4,
    status: 'Normal'
  }, {
    id: 4,
    name: 'UPS 1500VA',
    category: 'Power',
    inStock: 2,
    threshold: 3,
    status: 'Low'
  }];
  return <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">Inventory Status</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                In Stock
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventoryItems.map(item => <tr key={item.id}>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {item.name}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">{item.category}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">{item.inStock}</div>
                </td>
                <td className="px-4 py-3">
                  {item.status === 'Low' ? <div className="flex items-center">
                      <AlertTriangleIcon className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-yellow-700">Low Stock</span>
                    </div> : <span className="text-sm text-green-700">Normal</span>}
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-4 py-3 text-right">
        <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-500">
          View inventory
        </button>
      </div>
    </div>;
}
