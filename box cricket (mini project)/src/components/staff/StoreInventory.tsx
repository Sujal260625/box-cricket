import { useState, useEffect } from 'react';
import { User } from '../../App';
import {
    Package,
    ShoppingCart,
    CheckCircle,
    Clock,
    RefreshCcw,
    Search,
    IndianRupee
} from 'lucide-react';

interface StoreInventoryProps {
    currentUser: User;
}

export function StoreInventory({ currentUser }: StoreInventoryProps) {
    const [items, setItems] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [invRes, orderRes] = await Promise.all([
                fetch('http://localhost:5001/api/inventory'),
                fetch('http://localhost:5001/api/orders')
            ]);
            const invData = await invRes.json();
            const orderData = await orderRes.json();
            setItems(invData);
            setOrders(orderData.orders || []);
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUpdateStock = async (id: string, newQty: number) => {
        try {
            await fetch(`http://localhost:5001/api/inventory/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: newQty })
            });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const handleFulfillOrder = async (id: string) => {
        try {
            await fetch(`http://localhost:5001/api/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'delivered' })
            });
            fetchData();
        } catch (e) { console.error(e); }
    };

    const filteredItems = items.filter(i =>
        i.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Live Inventory Stack</h2>
                    <button onClick={fetchData} className="p-2 hover:bg-gray-100 rounded-full">
                        <RefreshCcw className="w-5 h-5 text-blue-600" />
                    </button>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map(item => (
                        <div key={item._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold">{item.itemName}</h3>
                                <span className={`px-2 py-1 rounded text-xs ${item.quantity < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {item.quantity} in stock
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                                <button
                                    onClick={() => handleUpdateStock(item._id, Math.max(0, item.quantity - 1))}
                                    className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                                >-</button>
                                <button
                                    onClick={() => handleUpdateStock(item._id, item.quantity + 1)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >+</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-6">Pending Orders</h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 text-left">
                            <tr>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Items</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.filter(o => o.status !== 'delivered').map(order => (
                                <tr key={order._id} className="border-t border-gray-100">
                                    <td className="p-4">
                                        <p className="font-medium">{order.userName}</p>
                                        <p className="text-xs text-gray-500">#{order._id.slice(-6)}</p>
                                    </td>
                                    <td className="p-4 text-sm">
                                        {order.items.map((i: any) => i.name).join(', ')}
                                    </td>
                                    <td className="p-4 font-bold text-green-600">₹{order.total}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleFulfillOrder(order._id)}
                                            className="text-blue-600 hover:underline text-sm font-medium"
                                        >
                                            Mark Delivered
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 italic">No pending orders</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
