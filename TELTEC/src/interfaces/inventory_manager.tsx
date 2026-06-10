// import React, { useState } from 'react';
// import { Plus, Edit3, Trash2, Package, Users, TrendingDown, TrendingUp, Search, Filter, X, Check, AlertTriangle } from 'lucide-react';

// type InventoryItem = {
//   id: number;
//   name: string;
//   category: string;
//   quantity: number;
//   minThreshold: number;
//   location: string;
//   lastUpdated: string;
//   unitPrice: number;
// };

// type Transaction = {
//   id: number;
//   itemId: number;
//   itemName: string;
//   workerName: string;
//   type: 'checkout' | 'return';
//   quantity: number;
//   date: string;
//   returnDate: string | null;
//   status: 'checked_out' | 'returned';
// };

// const InventoryManagement: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'inventory' | 'transactions'>('inventory');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showTransactionModal, setShowTransactionModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('all');

//   const [inventory, setInventory] = useState<InventoryItem[]>([
//     { 
//       id: 1, 
//       name: 'Safety Helmets', 
//       category: 'safety', 
//       quantity: 45, 
//       minThreshold: 10, 
//       location: 'Warehouse A',
//       lastUpdated: '2025-06-25',
//       unitPrice: 25.99
//     },
//     { 
//       id: 2, 
//       name: 'Drill Bits Set', 
//       category: 'tools', 
//       quantity: 5, 
//       minThreshold: 8, 
//       location: 'Tool Room',
//       lastUpdated: '2025-06-24',
//       unitPrice: 89.99
//     },
//     { 
//       id: 3, 
//       name: 'Work Gloves', 
//       category: 'safety', 
//       quantity: 78, 
//       minThreshold: 20, 
//       location: 'Warehouse B',
//       lastUpdated: '2025-06-26',
//       unitPrice: 12.50
//     },
//     { 
//       id: 4, 
//       name: 'Measuring Tape', 
//       category: 'tools', 
//       quantity: 15, 
//       minThreshold: 5, 
//       location: 'Tool Room',
//       lastUpdated: '2025-06-23',
//       unitPrice: 18.75
//     }
//   ]);

//   const [transactions, setTransactions] = useState<Transaction[]>([
//     {
//       id: 1,
//       itemId: 1,
//       itemName: 'Safety Helmets',
//       workerName: 'John Smith',
//       type: 'checkout',
//       quantity: 2,
//       date: '2025-06-26',
//       returnDate: null,
//       status: 'checked_out'
//     },
//     {
//       id: 2,
//       itemId: 3,
//       itemName: 'Work Gloves',
//       workerName: 'Sarah Johnson',
//       type: 'checkout',
//       quantity: 4,
//       date: '2025-06-25',
//       returnDate: '2025-06-26',
//       status: 'returned'
//     }
//   ]);

//   const [formData, setFormData] = useState({
//     name: '',
//     category: 'tools',
//     quantity: '',
//     minThreshold: '',
//     location: '',
//     unitPrice: ''
//   });

//   const [transactionData, setTransactionData] = useState({
//     itemId: '',
//     workerName: '',
//     type: 'checkout',
//     quantity: ''
//   });

//   const categories = ['all', 'tools', 'safety', 'materials', 'equipment'];

//   const filteredInventory = inventory.filter(item => {
//     const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const lowStockItems = inventory.filter(item => item.quantity <= item.minThreshold);

//   const handleAddItem = () => {
//     if (formData.name && formData.quantity && formData.minThreshold) {
//       const newItem = {
//         id: Date.now(),
//         ...formData,
//         quantity: parseInt(formData.quantity),
//         minThreshold: parseInt(formData.minThreshold),
//         unitPrice: parseFloat(formData.unitPrice) || 0,
//         lastUpdated: new Date().toISOString().split('T')[0]
//       };
//       setInventory([...inventory, newItem]);
//       setFormData({ name: '', category: 'tools', quantity: '', minThreshold: '', location: '', unitPrice: '' });
//       setShowAddModal(false);
//     }
//   };

//   const handleEditItem = () => {
//     if (selectedItem && formData.name && formData.quantity && formData.minThreshold) {
//       setInventory(inventory.map(item => 
//         item.id === selectedItem.id 
//           ? {
//               ...item,
//               ...formData,
//               quantity: parseInt(formData.quantity),
//               minThreshold: parseInt(formData.minThreshold),
//               unitPrice: parseFloat(formData.unitPrice) || 0,
//               lastUpdated: new Date().toISOString().split('T')[0]
//             }
//           : item
//       ));
//       setShowEditModal(false);
//       setSelectedItem(null);
//     }
//   };

//   const handleDeleteItem = (id: number) => {
//     setInventory(inventory.filter(item => item.id !== id));
//   };

//   const handleTransaction = () => {
//     if (transactionData.itemId && transactionData.workerName && transactionData.quantity) {
//       const item = inventory.find(i => i.id === parseInt(transactionData.itemId));
//       const quantity = parseInt(transactionData.quantity);
      
//       if (item && transactionData.type === 'checkout' && item.quantity >= quantity) {
//         // Create transaction record
//         const newTransaction: Transaction = {
//           id: Date.now(),
//           itemId: item.id,
//           itemName: item.name,
//           workerName: transactionData.workerName,
//           type: transactionData.type as 'checkout' | 'return',
//           quantity: quantity,
//           date: new Date().toISOString().split('T')[0],
//           returnDate: null,
//           status: 'checked_out'
//         };
//         setTransactions([...transactions, newTransaction]);
        
//         // Update inventory
//         setInventory(inventory.map(i => 
//           i.id === item.id 
//             ? { ...i, quantity: i.quantity - quantity, lastUpdated: new Date().toISOString().split('T')[0] }
//             : i
//         ));
//       } else if (item && transactionData.type === 'return') {
//         // Update inventory
//         setInventory(inventory.map(i => 
//           i.id === item.id 
//             ? { ...i, quantity: i.quantity + quantity, lastUpdated: new Date().toISOString().split('T')[0] }
//             : i
//         ));
//       }
      
//       setTransactionData({ itemId: '', workerName: '', type: 'checkout', quantity: '' });
//       setShowTransactionModal(false);
//     }
//   };

//   const openEditModal = (item: InventoryItem) => {
//     setSelectedItem(item);
//     setFormData({
//       name: item.name,
//       category: item.category,
//       quantity: item.quantity.toString(),
//       minThreshold: item.minThreshold.toString(),
//       location: item.location,
//       unitPrice: item.unitPrice.toString()
//     });
//     setShowEditModal(true);
//   };

//   const StockStatus = ({ item }: { item: InventoryItem }) => {
//     if (item.quantity === 0) {
//       return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Out of Stock</span>;
//     } else if (item.quantity <= item.minThreshold) {
//       return <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">Low Stock</span>;
//     }
//     return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">In Stock</span>;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       {/* Header */}
//       <div className="bg-green-600 shadow-lg border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <div className="bg-green-600 p-2 rounded-lg">
//                 <Package className="h-6 w-6 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
//                 <p className="text-sm text-white">Manage your stock and track worker transactions</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center space-x-2">
//                 <AlertTriangle className="h-4 w-4 text-red-600" />
//                 <span className="text-sm font-medium text-red-800">{lowStockItems.length} Low Stock Items</span>
//               </div>
//               <button
//                 onClick={() => setShowAddModal(true)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//               >
//                 <Plus className="h-4 w-4" />
//                 <span>Add Item</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="max-w-7xl mx-auto px-6 py-4">
//         <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
//           <button
//             onClick={() => setActiveTab('inventory')}
//             className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//               activeTab === 'inventory' 
//                 ? 'bg-white text-blue-600 shadow-sm' 
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             <Package className="h-4 w-4 inline mr-2" />
//             Inventory
//           </button>
//           <button
//             onClick={() => setActiveTab('transactions')}
//             className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//               activeTab === 'transactions' 
//                 ? 'bg-white text-blue-600 shadow-sm' 
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             <Users className="h-4 w-4 inline mr-2" />
//             Transactions
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-6 pb-8">
//         {activeTab === 'inventory' && (
//           <div>
//             {/* Search and Filter Bar */}
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
//               <div className="flex flex-wrap gap-4 items-center">
//                 <div className="flex-1 min-w-64">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
//                     <input
//                       type="text"
//                       placeholder="Search items..."
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Filter className="h-4 w-4 text-gray-400" />
//                   <select
//                     value={filterCategory}
//                     onChange={(e) => setFilterCategory(e.target.value)}
//                     className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     {categories.map(cat => (
//                       <option key={cat} value={cat}>
//                         {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <button
//                   onClick={() => setShowTransactionModal(true)}
//                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
//                 >
//                   <TrendingDown className="h-4 w-4" />
//                   <span>Check Out/Return</span>
//                 </button>
//               </div>
//             </div>

//             {/* Inventory Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredInventory.map(item => (
//                 <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
//                   <div className="p-6">
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex-1">
//                         <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
//                         <p className="text-sm text-gray-600 capitalize">{item.category}</p>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <button
//                           onClick={() => openEditModal(item)}
//                           className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                         >
//                           <Edit3 className="h-4 w-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteItem(item.id)}
//                           className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </button>
//                       </div>
//                     </div>
                    
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600">Quantity</span>
//                         <span className="font-semibold text-2xl text-gray-900">{item.quantity}</span>
//                       </div>
                      
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600">Status</span>
//                         <StockStatus item={item} />
//                       </div>
                      
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600">Location</span>
//                         <span className="text-sm font-medium text-gray-900">{item.location}</span>
//                       </div>
                      
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600">Unit Price</span>
//                         <span className="text-sm font-medium text-gray-900">${item.unitPrice}</span>
//                       </div>
                      
//                       <div className="pt-2 border-t border-gray-100">
//                         <span className="text-xs text-gray-500">Updated: {item.lastUpdated}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {activeTab === 'transactions' && (
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {transactions.map(transaction => (
//                     <tr key={transaction.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="font-medium text-gray-900">{transaction.itemName}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-900">{transaction.workerName}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center">
//                           {transaction.type === 'checkout' ? (
//                             <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
//                           ) : (
//                             <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
//                           )}
//                           <span className="capitalize">{transaction.type}</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-900">{transaction.quantity}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-gray-900">{transaction.date}</td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                           transaction.status === 'returned' 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {transaction.status === 'returned' ? 'Returned' : 'Checked Out'}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Add Item Modal */}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">Add New Item</h3>
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({...formData, name: e.target.value})}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   value={formData.category}
//                   onChange={(e) => setFormData({...formData, category: e.target.value})}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="tools">Tools</option>
//                   <option value="safety">Safety</option>
//                   <option value="materials">Materials</option>
//                   <option value="equipment">Equipment</option>
//                 </select>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
//                   <input
//                     type="number"
//                     value={formData.quantity}
//                     onChange={(e) => setFormData({...formData, quantity: e.target.value})}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Min Threshold</label>
//                   <input
//                     type="number"
//                     value={formData.minThreshold}
//                     onChange={(e) => setFormData({...formData, minThreshold: e.target.value})}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                 <input
//                   type="text"
//                   value={formData.location}
//                   onChange={(e) => setFormData({...formData, location: e.target.value})}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   value={formData.unitPrice}
//                   onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end space-x-3 mt-6">
//               <button
//                 onClick={() => setShowAddModal(false)}
//                 className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddItem}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//               >
//                 <Check className="h-4 w-4" />
//                 <span>Add Item</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Item Modal */}
//       {showEditModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">Edit Item</h3>
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData({...formData, name: e.target.value})}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                 <select
//                   value={formData.category}
//                   onChange={(e) => setFormData({...formData, category: e.target.value})}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="tools">Tools</option>
//                   <option value="safety">Safety</option>
//                   <option value="materials">Materials</option>
//                   <option value="equipment">Equipment</option>
//                 </select>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
//                   <input
//                     type="number"
//                     value={formData.quantity}
//                     onChange={(e) => setFormData({...formData, quantity: e.target.value})}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Min Threshold</label>
//                   <input
//                     type="number"
//                     value={formData.minThreshold}
//                     onChange={(e) => setFormData({...formData, minThreshold: e.target.value})}
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                 <input
//                   type="text"
//                   value={formData.location}
//                   onChange={(e) => setFormData({...formData, location: e.target.value})}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   value={formData.unitPrice}
//                   onChange={(e) => setFormData({...formData, unitPrice: e.target.value})}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end space-x-3 mt-6">
//               <button
//                 onClick={() => setShowEditModal(false)}
//                 className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEditItem}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//               >
//                 <Check className="h-4 w-4" />
//                 <span>Update Item</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Transaction Modal */}
//       {showTransactionModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-lg font-semibold text-gray-900">Check Out / Return Item</h3>
//               <button
//                 onClick={() => setShowTransactionModal(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
//                 <select
//                   value={transactionData.itemId}
//                   onChange={(e) => setTransactionData({...transactionData, itemId: e.target.value})}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="">Select an item</option>
//                   {inventory.map(item => (
//                     <option key={item.id} value={item.id}>
//                       {item.name} (Available: {item.quantity})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Worker Name</label>
//                 <input
//                   type="text"
//                   value={transactionData.workerName}
//                   onChange={(e) => setTransactionData({...transactionData, workerName: e.target.value})}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Enter worker name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
//                 <select
//                   value={transactionData.type}
//                   onChange={(e) => setTransactionData({...transactionData, type: e.target.value})}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 >
//                   <option value="checkout">Check Out</option>
//                   <option value="return">Return</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
//                 <input
//                   type="number"
//                   value={transactionData.quantity}
//                   onChange={(e) => setTransactionData({...transactionData, quantity: e.target.value})}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   min="1"
//                 />
//               </div>
//             </div>
//             <div className="flex justify-end space-x-3 mt-6">
//               <button
//                 onClick={() => setShowTransactionModal(false)}
//                 className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleTransaction}
//                 className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
//               >
//                 <Check className="h-4 w-4" />
//                 <span>Process Transaction</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default InventoryManagement;


import React, { useEffect, useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  Package,
  Users,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  X,
  Check,
  AlertTriangle
} from 'lucide-react';

type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  minThreshold: number;
  location: string;
  lastUpdated: string;
  unitPrice: number;
};

type Transaction = {
  id: number;
  itemId: number;
  itemName: string;
  workerName: string;
  type: 'checkout' | 'return';
  quantity: number;
  date: string;
  returnDate: string | null;
  status: 'checked_out' | 'returned';
};

const API_BASE = 'http://localhost:8081';

const InventoryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'transactions'>('inventory');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'tools',
    quantity: '',
    minThreshold: '',
    location: '',
    unitPrice: ''
  });

  const [transactionData, setTransactionData] = useState({
    itemId: '',
    workerName: '',
    type: 'checkout',
    quantity: ''
  });

  const categories = ['all', 'tools', 'safety', 'materials', 'equipment'];

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // inventory
      const invRes = await fetch(`${API_BASE}/api/inventory`);
      const invJson = await invRes.json();
      if (!invRes.ok) {
        throw new Error(invJson?.error || 'Failed to fetch inventory');
      }
      setInventory(Array.isArray(invJson.data) ? invJson.data : []);

      // transactions
      const txRes = await fetch(`${API_BASE}/api/transactions`);
      const txJson = await txRes.json();
      if (!txRes.ok) {
        // not fatal — show empty transactions but record error
        console.warn('Failed to load transactions', txJson);
        setTransactions([]);
      } else {
        setTransactions(Array.isArray(txJson.data) ? txJson.data : []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => item.quantity <= item.minThreshold);

  // Create
  const handleAddItem = async () => {
    setError(null);
    if (!formData.name || !formData.quantity) {
      setError('Name and quantity are required');
      return;
    }

    try {
      const body = {
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity || '0', 10),
        minThreshold: parseInt(formData.minThreshold || '0', 10),
        location: formData.location || null,
        unitPrice: parseFloat(formData.unitPrice || '0')
      };

      const res = await fetch(`${API_BASE}/api/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to add item');

      // prepend new item
      setInventory(prev => [data.data, ...prev]);
      setFormData({ name: '', category: 'tools', quantity: '', minThreshold: '', location: '', unitPrice: '' });
      setShowAddModal(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to add item');
    }
  };

  // Update
  const handleEditItem = async () => {
    setError(null);
    if (!selectedItem) return;
    if (!formData.name || !formData.quantity) {
      setError('Name and quantity are required');
      return;
    }

    try {
      const id = selectedItem.id;
      const body = {
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity || '0', 10),
        minThreshold: parseInt(formData.minThreshold || '0', 10),
        location: formData.location || null,
        unitPrice: parseFloat(formData.unitPrice || '0')
      };

      const res = await fetch(`${API_BASE}/api/inventory/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to update item');

      setInventory(prev => prev.map(i => (i.id === id ? data.data : i)));
      setShowEditModal(false);
      setSelectedItem(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update item');
    }
  };

  // Delete
  const handleDeleteItem = async (id: number) => {
    setError(null);
    if (!window.confirm('Delete this item?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/inventory/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to delete item');

      setInventory(prev => prev.filter(i => i.id !== id));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete item');
    }
  };

  // Transactions (checkout / return)
  const handleTransaction = async () => {
    setError(null);
    if (!transactionData.itemId || !transactionData.workerName || !transactionData.quantity) {
      setError('Please provide item, worker name and quantity');
      return;
    }

    try {
      const itemId = parseInt(transactionData.itemId, 10);
      const qty = parseInt(transactionData.quantity, 10);
      if (isNaN(itemId) || isNaN(qty) || qty <= 0) {
        setError('Invalid item or quantity');
        return;
      }

      const endpoint =
        transactionData.type === 'checkout'
          ? `${API_BASE}/api/transactions/checkout`
          : `${API_BASE}/api/transactions/return`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, workerName: transactionData.workerName, quantity: qty })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to process transaction');

      // refresh both lists (simple and consistent)
      await fetchData();

      setTransactionData({ itemId: '', workerName: '', type: 'checkout', quantity: '' });
      setShowTransactionModal(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Transaction failed');
    }
  };

  const openEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      minThreshold: item.minThreshold.toString(),
      location: item.location || '',
      unitPrice: (item.unitPrice || 0).toString()
    });
    setShowEditModal(true);
  };

  const StockStatus = ({ item }: { item: InventoryItem }) => {
    if (item.quantity === 0) {
      return <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">Out of Stock</span>;
    } else if (item.quantity <= item.minThreshold) {
      return <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-800 rounded-full">Low Stock</span>;
    }
    return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">In Stock</span>;
  };

  // Quick UI helper: display a toast-like alert at top of page when there's an error
  const ErrorBanner = ({ message }: { message: string }) => (
    <div className="max-w-7xl mx-auto px-6 py-3">
      <div className="bg-red-100 border border-red-300 text-red-800 rounded-lg px-4 py-2 text-sm">{message}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* simple error banner */}
      {error && <ErrorBanner message={error} />}

      {/* Header */}
      <div className="bg-green-600 shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
                <p className="text-sm text-white">Manage your stock and track worker transactions</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">{lowStockItems.length} Low Stock Items</span>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'inventory' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="h-4 w-4 inline mr-2" />
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'transactions' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Transactions
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {activeTab === 'inventory' && (
          <div>
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-64">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setShowTransactionModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <TrendingDown className="h-4 w-4" />
                  <span>Check Out/Return</span>
                </button>
              </div>
            </div>

            {/* Inventory Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12 text-gray-500">Loading inventory...</div>
              ) : filteredInventory.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-500">No items found.</div>
              ) : (
                filteredInventory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Quantity</span>
                          <span className="font-semibold text-2xl text-gray-900">{item.quantity}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <StockStatus item={item} />
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Location</span>
                          <span className="text-sm font-medium text-gray-900">{item.location}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Unit Price</span>
                          <span className="text-sm font-medium text-gray-900">${item.unitPrice}</span>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                          <span className="text-xs text-gray-500">Updated: {item.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        No transactions yet.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{transaction.itemName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{transaction.workerName}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {transaction.type === 'checkout' ? (
                              <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                            ) : (
                              <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                            )}
                            <span className="capitalize">{transaction.type}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{transaction.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{transaction.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.status === 'returned' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {transaction.status === 'returned' ? 'Returned' : 'Checked Out'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Item</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="tools">Tools</option>
                  <option value="safety">Safety</option>
                  <option value="materials">Materials</option>
                  <option value="equipment">Equipment</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Check className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Item</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="tools">Tools</option>
                  <option value="safety">Safety</option>
                  <option value="materials">Materials</option>
                  <option value="equipment">Equipment</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditItem}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Check className="h-4 w-4" />
                <span>Update Item</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Check Out / Return Item</h3>
              <button onClick={() => setShowTransactionModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                <select
                  value={transactionData.itemId}
                  onChange={(e) => setTransactionData({ ...transactionData, itemId: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select an item</option>
                  {inventory.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (Available: {item.quantity})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Worker Name</label>
                <input
                  type="text"
                  value={transactionData.workerName}
                  onChange={(e) => setTransactionData({ ...transactionData, workerName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter worker name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                <select
                  value={transactionData.type}
                  onChange={(e) => setTransactionData({ ...transactionData, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="checkout">Check Out</option>
                  <option value="return">Return</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={transactionData.quantity}
                  onChange={(e) => setTransactionData({ ...transactionData, quantity: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowTransactionModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTransaction}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Check className="h-4 w-4" />
                <span>Process Transaction</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
