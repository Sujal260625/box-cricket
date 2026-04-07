import React, { useState } from 'react';
import { Users, Search, Filter, MoreVertical, Star, Calendar, Phone, X, Trash2 } from 'lucide-react';

interface PlayerDatabaseProps {
    players: any[];
    onPlayerAdded?: (player: any) => void;
    onPlayerDeleted?: (playerId: string) => void;
}

export default function PlayerDatabase({ players, onPlayerAdded, onPlayerDeleted }: PlayerDatabaseProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPlayer, setNewPlayer] = useState({
        name: '',
        aadharCard: '',
        phone: '',
        startingTime: '09:00',
        endingTime: '10:00'
    });

    const filteredPlayers = players.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleAddPlayer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/players', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPlayer)
            });
            if (response.ok) {
                const data = await response.json();
                setIsAddModalOpen(false);
                setNewPlayer({ name: '', aadharCard: '', phone: '', startingTime: '09:00', endingTime: '10:00' });
                if (onPlayerAdded && data.player) {
                    onPlayerAdded(data.player);
                }
            }
        } catch (error) {
            console.error('Failed to add player', error);
        }
    };

    const handleDeletePlayer = async (playerId: string) => {
        if (window.confirm("Are you sure you want to delete this player?")) {
            try {
                const response = await fetch(`http://localhost:5001/api/players/${playerId}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    if (onPlayerDeleted) {
                        onPlayerDeleted(playerId);
                    }
                }
            } catch (error) {
                console.error('Failed to delete player', error);
            }
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Player Registry</h2>
                        <p className="text-xs text-gray-500 font-medium">{filteredPlayers.length} Members active</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64 lg:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search players by name or ID..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 rounded-xl text-sm transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-sm whitespace-nowrap"
                    >
                        <span className="text-lg leading-none">+</span>
                        Add Player
                    </button>
                </div>
            </div>

            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
                        <button 
                            onClick={() => setIsAddModalOpen(false)}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Player</h2>
                        <form onSubmit={handleAddPlayer} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Player Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newPlayer.name}
                                    onChange={(e) => setNewPlayer(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 rounded-xl text-sm outline-none border transition-all"
                                    placeholder="Enter full name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhar Card</label>
                                <input
                                    type="text"
                                    value={newPlayer.aadharCard}
                                    onChange={(e) => setNewPlayer(prev => ({ ...prev, aadharCard: e.target.value }))}
                                    className="w-full px-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 rounded-xl text-sm outline-none border transition-all"
                                    placeholder="Enter Aadhar number"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={newPlayer.phone}
                                    onChange={(e) => setNewPlayer(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 rounded-xl text-sm outline-none border transition-all"
                                    placeholder="Enter mobile number"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startingTime" className="block text-sm font-semibold text-gray-700 mb-1">Starting Time</label>
                                    <input
                                        id="startingTime"
                                        type="time"
                                        value={newPlayer.startingTime}
                                        onChange={(e) => setNewPlayer(prev => ({ ...prev, startingTime: e.target.value }))}
                                        className="w-full px-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 rounded-xl text-sm outline-none border transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="endingTime" className="block text-sm font-semibold text-gray-700 mb-1">Ending Time</label>
                                    <input
                                        id="endingTime"
                                        type="time"
                                        value={newPlayer.endingTime}
                                        onChange={(e) => setNewPlayer(prev => ({ ...prev, endingTime: e.target.value }))}
                                        className="w-full px-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-blue-200 rounded-xl text-sm outline-none border transition-all"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all mt-4"
                            >
                                Save Player
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400">
                            <th className="px-6 py-4">Player Details</th>
                            <th className="px-6 py-4">Contact</th>
                            <th className="px-6 py-4">Aadhar Card</th>
                            <th className="px-6 py-4">Timing</th>
                            <th className="px-6 py-4">Rating</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredPlayers.map((player) => (
                            <tr key={player._id || player.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600 border-2 border-white shadow-sm">
                                            {player.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{player.name}</p>
                                            <p className="text-[10px] text-gray-400 uppercase font-black">ID: {String(player._id || player.id).slice(-6).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Phone className="w-3 h-3 text-gray-400" />
                                            <span>{player.phone || 'No Phone'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-blue-600 hover:underline cursor-pointer font-medium">
                                            <span>{player.email || 'no-email@turf.com'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs text-gray-700 font-medium">
                                        {player.aadharCard || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-xs text-gray-700">
                                        {player.startingTime && player.endingTime ? (
                                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">
                                                {player.startingTime} - {player.endingTime}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} className={`w-3 h-3 ${s <= (player.rating || 4) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                                        ))}
                                        <span className="ml-1 text-xs font-bold text-gray-600">{player.rating || 4.2}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    player.membershipStatus === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                                        {player.membershipStatus || 'active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleDeletePlayer(player._id || player.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-all text-gray-400 hover:text-red-600"
                                        title="Delete Player"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredPlayers.length === 0 && (
                            <tr>
                                <td colSpan={7} className="py-20 text-center">
                                    <div className="opacity-20 flex flex-col items-center">
                                        <Search className="w-12 h-12 mb-2" />
                                        <p className="font-bold text-xl uppercase tracking-widest">No Players Found</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
