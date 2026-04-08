import React, { useState, useEffect } from 'react';
import { Gavel, Clock, Trophy, User, ArrowUpCircle, CheckCircle2 } from 'lucide-react';

interface AuctionItem {
    _id: string;
    title: string;
    description: string;
    items: Array<{
        _id: string;
        name: string;
        startingBid: number;
        currentBid: number;
        highestBidder?: string;
    }>;
    startTime: string;
    endTime: string;
    status: 'upcoming' | 'active' | 'completed';
}

interface AuctionSystemProps {
    currentUser: any;
    onClose?: () => void;
    isModal?: boolean;
}

export function AuctionSystem({ currentUser, onClose, isModal = true }: AuctionSystemProps) {
    const [auctions, setAuctions] = useState<AuctionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [bidAmount, setBidAmount] = useState<number>(0);
    const [activeAuctionId, setActiveAuctionId] = useState<string | null>(null);
    const [activeItemId, setActiveItemId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newAuction, setNewAuction] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        itemName: '',
        startingBid: 0
    });

    useEffect(() => {
        fetchAuctions();
        const interval = setInterval(fetchAuctions, 10000); // Polling every 10s
        return () => clearInterval(interval);
    }, []);

    const fetchAuctions = async () => {
        try {
            const response = await fetch('https://box-cricket-qt23.onrender.com/api/auctions');
            const data = await response.json();
            setAuctions(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching auctions:', error);
            setLoading(false);
        }
    };

    const handleBid = async (auctionId: string, itemId: string, currentBid: number) => {
        if (!currentUser) {
            setMessage({ type: 'error', text: 'Please login to place a bid' });
            return;
        }

        if (bidAmount <= currentBid) {
            setMessage({ type: 'error', text: `Bid must be higher than ₹${currentBid}` });
            return;
        }

        try {
            const response = await fetch(`https://box-cricket-qt23.onrender.com/api/auctions/${auctionId}/bid`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemId,
                    amount: bidAmount,
                    userId: currentUser.id,
                    userName: currentUser.name
                })
            });

            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Your bid has been placed!' });
                fetchAuctions();
                setBidAmount(0);
                setActiveAuctionId(null);
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to place bid. Please try again.' });
        }
    };

    const handleCreateAuction = async () => {
        if (!currentUser) return;
        try {
            const auctionData = {
                title: newAuction.title,
                description: newAuction.description,
                startTime: new Date(newAuction.startTime).toISOString(),
                endTime: new Date(newAuction.endTime).toISOString(),
                items: [{
                    name: newAuction.itemName,
                    startingBid: newAuction.startingBid,
                    currentBid: newAuction.startingBid
                }],
                createdBy: currentUser.id,
                creatorName: currentUser.name
            };

            const response = await fetch('https://box-cricket-qt23.onrender.com/api/auctions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(auctionData)
            });

            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Auction created successfully!' });
                setShowCreateForm(false);
                fetchAuctions();
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to create auction' });
        }
    };

    const handleDeleteAuction = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this auction?')) return;
        try {
            const response = await fetch(`https://box-cricket-qt23.onrender.com/api/auctions/${id}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Auction deleted' });
                fetchAuctions();
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete auction' });
        }
    };

    const getTimeRemaining = (endTime: string) => {
        const total = Date.parse(endTime) - Date.now();
        if (total <= 0) return 'Ended';
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));
        return `${days > 0 ? days + 'd ' : ''}${hours}h ${minutes}m ${seconds}s`;
    };

    const content = (
            <div className={`bg-white shadow-2xl flex flex-col border border-gray-100 ${isModal ? 'rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden' : 'rounded-xl h-full'}`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-green-500 p-6 flex justify-between items-center text-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <Gavel className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Turf Equipment Auction</h2>
                            <p className="text-emerald-50 text-sm">Bid on premium quality gear and exclusive slots</p>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                            Create Auction
                        </button>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* Status Message */}
                {message && (
                    <div className={`p-4 text-center text-sm font-medium animate-in fade-in slide-in-from-top duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        <div className="flex items-center justify-center gap-2">
                            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-red-500 flex items-center justify-center text-[10px]">!</div>}
                            {message.text}
                        </div>
                    </div>
                )}

                {/* Create Auction Form */}
                {showCreateForm && (
                    <div className="p-6 bg-emerald-50 border-b border-emerald-100 animate-in slide-in-from-top duration-300">
                        <h3 className="font-bold text-emerald-900 mb-4">Create New Auction</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input 
                                placeholder="Auction Title (e.g. SF Bat)" 
                                className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={newAuction.title}
                                onChange={e => setNewAuction({...newAuction, title: e.target.value})}
                            />
                            <input 
                                placeholder="Item Name" 
                                className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={newAuction.itemName}
                                onChange={e => setNewAuction({...newAuction, itemName: e.target.value})}
                            />
                            <input 
                                type="number" 
                                placeholder="Starting Bid" 
                                className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={newAuction.startingBid || ''}
                                onChange={e => setNewAuction({...newAuction, startingBid: parseInt(e.target.value)})}
                            />
                            <div className="col-span-1 md:col-span-2">
                                <textarea 
                                    placeholder="Description" 
                                    className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={newAuction.description}
                                    onChange={e => setNewAuction({...newAuction, description: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-emerald-700">Start Time</label>
                                <input 
                                    type="datetime-local" 
                                    className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={newAuction.startTime}
                                    onChange={e => setNewAuction({...newAuction, startTime: e.target.value})}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-emerald-700">End Time</label>
                                <input 
                                    type="datetime-local" 
                                    className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-emerald-500 outline-none"
                                    value={newAuction.endTime}
                                    onChange={e => setNewAuction({...newAuction, endTime: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <button onClick={handleCreateAuction} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold">Create</button>
                            <button onClick={() => setShowCreateForm(false)} className="bg-gray-200 px-6 py-2 rounded-lg font-bold">Cancel</button>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-6 bg-gray-100/30">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-medium tracking-wide">Loading exclusive auctions...</p>
                        </div>
                    ) : auctions.filter(a => {
                        const now = new Date();
                        const start = new Date(a.startTime);
                        const end = new Date(a.endTime);
                        // Always show to admin/staff, otherwise only during duration
                        if (currentUser?.role === 'admin' || currentUser?.role === 'staff') return true;
                        return now >= start; // Show once it starts, even if ended (shows 'Ended')
                    }).length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Gavel className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">No active auctions</h3>
                            <p className="text-gray-500 mt-2">Check back later for premium cricket equipment and VIP slots.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {auctions.filter(a => {
                                const now = new Date();
                                const start = new Date(a.startTime);
                                if (currentUser?.role === 'admin' || currentUser?.role === 'staff') return true;
                                return now >= start;
                            }).map((auction) => {
                                const isEnded = new Date(auction.endTime) <= new Date();
                                const isUpcoming = new Date(auction.startTime) > new Date();
                                
                                return (
                                <div key={auction._id} className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow ${isEnded ? 'opacity-75 blur-[0.5px]' : ''}`}>
                                    <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-lg text-gray-800">{auction.title}</h3>
                                            {isEnded && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-black uppercase">Ended</span>}
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isEnded ? 'bg-gray-100 text-gray-400' : 'bg-emerald-50 text-emerald-700'}`}>
                                                <Clock className="w-3 h-3" />
                                                {getTimeRemaining(auction.endTime)}
                                            </div>
                                            {(currentUser?.role === 'admin' || currentUser?.role === 'staff') && (
                                                <button 
                                                    onClick={() => handleDeleteAuction(auction._id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <Trophy className="w-4 h-4 rotate-180" /> {/* Trash substitute */}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        {auction.items.map((item) => (
                                            <div key={item._id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                                                        <p className="text-sm text-gray-500 mt-0.5">Starting at ₹{item.startingBid}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-tighter">Current Bid</p>
                                                        <p className="text-2xl font-black text-emerald-600">₹{item.currentBid}</p>
                                                    </div>
                                                </div>

                                                {item.highestBidder && (
                                                    <div className="flex items-center gap-2 text-xs py-1.5 px-3 bg-white rounded-lg border border-gray-100 shadow-sm w-fit">
                                                        <Trophy className="w-3 h-3 text-amber-500" />
                                                        <span className="text-gray-500">Highest Bidder:</span>
                                                        <span className="font-bold text-gray-800">{item.highestBidder}</span>
                                                    </div>
                                                )}

                                                {activeAuctionId === auction._id && activeItemId === item._id ? (
                                                    <div className="flex gap-2 animate-in zoom-in duration-200">
                                                        <div className="relative flex-1">
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                                            <input
                                                                type="number"
                                                                value={bidAmount || ''}
                                                                onChange={(e) => setBidAmount(parseInt(e.target.value))}
                                                                className="w-full pl-7 pr-4 py-2 bg-white border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none font-bold"
                                                                placeholder={`Min ${item.currentBid + 10}`}
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => handleBid(auction._id, item._id, item.currentBid)}
                                                            className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={() => { setActiveAuctionId(null); setActiveItemId(null); }}
                                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setActiveAuctionId(auction._id);
                                                            setActiveItemId(item._id);
                                                            setBidAmount(item.currentBid + 10);
                                                        }}
                                                        disabled={auction.status !== 'active'}
                                                        className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-bold hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 group"
                                                    >
                                                        <ArrowUpCircle className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
                                                        {auction.status === 'active' ? 'Place a Bid' : 'Auction Closed'}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-100 border-t flex justify-between items-center text-xs text-gray-500 font-medium">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {currentUser?.name || 'Guest'}</span>
                        <span className="bg-white px-2 py-0.5 rounded border border-gray-200">Balance: ₹10,000 (Demo)</span>
                    </div>
                    <p>© 2026 TurfFlow Premium Auctions</p>
                </div>
            </div>
    );

    if (!isModal) {
        return content;
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            {content}
        </div>
    );
}

