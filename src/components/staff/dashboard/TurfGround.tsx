import React, { useState, useEffect } from 'react';
import { Layout, MapPin, Maximize, Target, Info, Plus, Trash2 } from 'lucide-react';

export default function TurfGround() {
    const [grounds, setGrounds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newGround, setNewGround] = useState({ name: '', status: 'active', color: 'bg-green-500' });

    const API_BASE_URL = '/api';

    useEffect(() => {
        fetchGrounds();
    }, []);

    const fetchGrounds = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/grounds`);
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            setGrounds(data);
        } catch (error) {
            console.error('Error fetching grounds:', error);
            // Fallback to initial static data ONLY if backend request fails entirely mapping static state or if DB goes offline.
            setGrounds([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGround = async () => {
        if (!newGround.name) return;
        try {
            const res = await fetch(`${API_BASE_URL}/grounds`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newGround)
            });
            const data = await res.json();
            if (data.success) {
                setGrounds([...grounds, data.ground]);
                setShowAddModal(false);
                setNewGround({ name: '', status: 'active', color: 'bg-green-500' });
            }
        } catch (error) {
            console.error('Error adding ground:', error);
        }
    };

    const handleDeleteGround = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this ground?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/grounds/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setGrounds(grounds.filter(g => g._id !== id));
            }
        } catch (error) {
            console.error('Error deleting ground:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Turf Management</h1>
                    <p className="text-gray-500 font-medium">Live ground status and facility monitoring</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-white rounded-xl shadow-sm border hover:bg-gray-50 transition-colors">
                        <Maximize className="w-5 h-5 text-gray-600" />
                    </button>
                    <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
                        <Plus className="w-4 h-4" />
                        Add Ground
                    </button>
                </div>
            </div>

            {/* ADD GROUND MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-5">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-5 border-b pb-3">Add New Ground</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Ground Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="e.g. Main Pitch"
                                    value={newGround.name}
                                    onChange={(e) => setNewGround({ ...newGround, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                                <select
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                                    value={newGround.status}
                                    onChange={(e) => {
                                        const status = e.target.value;
                                        let color = 'bg-green-500';
                                        if (status === 'occupied') color = 'bg-yellow-500';
                                        if (status === 'maintenance') color = 'bg-red-500';
                                        setNewGround({ ...newGround, status, color });
                                    }}
                                >
                                    <option value="active">Active</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddGround}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
                            >
                                Create Ground
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Map Canvas */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="aspect-[16/9] bg-green-950 rounded-2xl relative overflow-hidden border-8 border-green-900 shadow-inner">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}></div>

                        {/* Turf Boundary */}
                        <div className="absolute inset-4 border-2 border-white/30 rounded-xl"></div>

                        {/* Interactive Zones */}
                        <div className="absolute top-[20%] left-[10%] w-[35%] h-[60%] bg-green-500/20 border-2 border-green-400 rounded-lg flex items-center justify-center group cursor-pointer hover:bg-green-400/30 transition-all">
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">Main Pitch</span>
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>

                        <div className="absolute top-[20%] right-[10%] w-[35%] h-[25%] bg-yellow-500/20 border-2 border-yellow-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-yellow-400/30 transition-all">
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">Practice A</span>
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>

                        <div className="absolute bottom-[20%] right-[10%] w-[35%] h-[25%] bg-red-500/20 border-2 border-red-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-red-400/30 transition-all">
                            <span className="text-[10px] font-black text-white uppercase tracking-wider">Maintenance</span>
                            <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                    </div>
                </div>

                {/* Status Panel */}
                <div className="space-y-4">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-600" />
                            Zone Status
                        </h2>
                        <div className="space-y-3">
                            {grounds.length === 0 && !loading && (
                                <p className="text-sm text-gray-500 italic p-3 text-center border border-dashed rounded-xl">No grounds found. Add one above.</p>
                            )}
                            {loading && (
                                <p className="text-sm text-gray-500 italic p-3 text-center">Loading grounds...</p>
                            )}
                            {grounds.map(zone => (
                                <div key={zone._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${zone.color}`}></div>
                                        <span className="font-bold text-sm text-gray-700">{zone.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-gray-400 uppercase">{zone.status}</span>
                                        <button onClick={() => handleDeleteGround(zone._id)} className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

