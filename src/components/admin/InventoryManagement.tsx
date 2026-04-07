import { useState, useEffect } from 'react';
import { User } from '../../App';
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  XCircle
} from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: 'food' | 'sports';
  price: number;
  stock: number;
  minStock: number;
  maxStock: number;
  storeLocation: string;
  supplier: string;
  lastRestocked: string;
  totalSold: number;
}

interface InventoryManagementProps {
  currentUser: User;
  onClose?: () => void;
  isModal?: boolean;
}

export function InventoryManagement({ currentUser, onClose, isModal = true }: InventoryManagementProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/inventory');
      const data = await response.json();
      const mappedData = data.map((item: any) => ({
        ...item,
        id: item._id || item.id || Math.random().toString(),
        name: item.itemName || item.name || 'Unknown Item',
        category: item.category || 'sports',
        price: Number(item.price) || 0,
        stock: Number(item.stock ?? item.quantity) || 0,
        minStock: Number(item.minStock) || 5,
        maxStock: Number(item.maxStock) || 50,
        supplier: item.supplier || 'General Supplier',
        totalSold: Number(item.totalSold) || 0,
        storeLocation: item.storeLocation || 'Main Store'
      }));
      setInventory(mappedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const [newItem, setNewItem] = useState({
    itemName: '',
    category: 'food' as 'food' | 'sports',
    price: 0,
    quantity: 0,
    minStock: 10,
    maxStock: 100,
    storeLocation: '',
    supplier: '',
    lastRestocked: new Date().toISOString().split('T')[0],
    totalSold: 0
  });

  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'food' | 'sports'>('all');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch =
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.storeLocation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.supplier || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const lowStockItems = inventory.filter(item => (item.stock || 0) <= (item.minStock || 0));
  const totalItems = inventory.length;
  const totalValue = inventory.reduce((sum, item) => sum + ((item.price || 0) * (item.stock || 0)), 0);

  const handleAddItem = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      const data = await response.json();
      if (data.success) {
        fetchInventory();
        setNewItem({
          itemName: '',
          category: 'food',
          price: 0,
          quantity: 0,
          minStock: 10,
          maxStock: 100,
          storeLocation: '',
          supplier: '',
          lastRestocked: new Date().toISOString().split('T')[0],
          totalSold: 0
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleUpdateItem = async () => {
    if (editingItem) {
      try {
        const response = await fetch(`http://localhost:5001/api/inventory/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemName: editingItem.name,
            ...editingItem
          })
        });
        const data = await response.json();
        if (data.success) {
          fetchInventory();
          setEditingItem(null);
        }
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await fetch(`http://localhost:5001/api/inventory/${id}`, {
          method: 'DELETE'
        });
        fetchInventory();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const handleRestock = async (id: string, quantityAddition: number) => {
    const item = inventory.find(i => i.id === id);
    if (item) {
      try {
        await fetch(`http://localhost:5001/api/inventory/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            quantity: (item.stock || 0) + quantityAddition,
            lastChecked: new Date()
          })
        });
        fetchInventory();
      } catch (error) {
        console.error('Error restocking:', error);
      }
    }
  };

  const updateItemField = (field: keyof InventoryItem, value: any) => {
    if (editingItem) {
      setEditingItem({ ...editingItem, [field]: value });
    }
  };

  const content = (
    <div className={`${isModal ? 'p-6' : ''}`}>
      {!isModal ? (
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Inventory Management</h1>
            <p className="text-gray-500 mt-1">Monitor and manage your facility's supplies and equipment.</p>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 rounded-xl mr-4">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-green-50 rounded-xl mr-4">
              <IndianRupee className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-50 rounded-xl mr-4">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockItems.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 bg-purple-50 rounded-xl mr-4">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sold</p>
              <p className="text-2xl font-bold text-gray-900">
                {inventory.reduce((sum, item) => sum + (item.totalSold || 0), 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search items, categories, or suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 transition-all font-medium"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-green-500 transition-all font-medium min-w-[180px]"
          >
            <option value="all">All Categories</option>
            <option value="food">Food & Beverage</option>
            <option value="sports">Sports Equipment</option>
          </select>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center justify-center gap-2 font-bold shadow-lg shadow-green-200 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Add New Item
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white border-2 border-green-100 p-8 rounded-2xl shadow-xl mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Add New Inventory Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-1 lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
              <input
                type="text"
                value={newItem.itemName}
                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="e.g., Cricket Ball (Pro)"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value as 'food' | 'sports' })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              >
                <option value="food">Food & Beverage</option>
                <option value="sports">Sports Equipment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Stock</label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Min Alert Level</label>
              <input
                type="number"
                value={newItem.minStock}
                onChange={(e) => setNewItem({ ...newItem, minStock: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Stock Level</label>
              <input
                type="number"
                value={newItem.maxStock}
                onChange={(e) => setNewItem({ ...newItem, maxStock: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={newItem.storeLocation}
                onChange={(e) => setNewItem({ ...newItem, storeLocation: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Warehouse A"
              />
            </div>
            <div className="col-span-1 lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier Info</label>
              <input
                type="text"
                value={newItem.supplier}
                onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Name and contact"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleAddItem}
              className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold shadow-lg transition-all"
            >
              Add Item
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-bold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {editingItem && (
        <div className="bg-white border-2 border-blue-100 p-8 rounded-2xl shadow-xl mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Inventory Item</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="col-span-1 lg:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
              <input
                type="text"
                value={editingItem.name}
                onChange={(e) => updateItemField('name', e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                value={editingItem.category}
                onChange={(e) => updateItemField('category', e.target.value as 'food' | 'sports')}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="food">Food & Beverage</option>
                <option value="sports">Sports Equipment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
              <input
                type="number"
                value={editingItem.price}
                onChange={(e) => updateItemField('price', Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Stock</label>
              <input
                type="number"
                value={editingItem.stock}
                onChange={(e) => updateItemField('stock', Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Min Alert Level</label>
              <input
                type="number"
                value={editingItem.minStock}
                onChange={(e) => updateItemField('minStock', Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Stock Level</label>
              <input
                type="number"
                value={editingItem.maxStock}
                onChange={(e) => updateItemField('maxStock', Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={editingItem.storeLocation}
                onChange={(e) => updateItemField('storeLocation', e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleUpdateItem}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg transition-all"
            >
              Update Changes
            </button>
            <button
              onClick={() => setEditingItem(null)}
              className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 font-bold transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item Details</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredInventory.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${item.category === 'food' ? 'bg-orange-50' : 'bg-blue-50'}`}>
                      {item.category === 'food' ? <ShoppingCart className="w-4 h-4 text-orange-600" /> : <Package className="w-4 h-4 text-blue-600" />}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-tight">{item.storeLocation}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${item.category === 'food'
                    ? 'bg-orange-50 text-orange-600 border border-orange-100'
                    : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-gray-900">₹{item.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                      <span className={item.stock <= item.minStock ? 'text-red-500' : 'text-gray-400'}>
                        {item.stock} / {item.maxStock}
                      </span>
                      {item.stock <= item.minStock && (
                        <span className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="w-3 h-3" />
                          Critical
                        </span>
                      )}
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.stock <= item.minStock ? 'bg-red-500' :
                          item.stock <= item.minStock * 1.5 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                        style={{ width: `${Math.min(100, (item.stock / item.maxStock) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="Edit Item"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRestock(item.id, 10)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all"
                      title="Quick Restock (+10)"
                    >
                      <TrendingUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredInventory.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-200" />
            </div>
            <p className="text-gray-400 font-medium">No items found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20">
        <div className="flex-1 overflow-auto bg-gray-50/50">
          {content}
        </div>
      </div>
    </div>
  );
}