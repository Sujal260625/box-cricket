import { User } from '../../App';
import { useState, useEffect } from 'react';
import {
  DollarSign,
  Activity,
  Calendar,
  Store,
  LogOut,
  Settings,
  CheckCircle,
  IndianRupee,
  ChartLine,
  Plus,
  UserCircle,
  Users,
  Layout,
  Gavel,
  Menu,
  X
} from 'lucide-react';
import { AuctionSystem } from '../user/AuctionSystem';
import LiveScoreCard from './matches/LiveScoreCard';
import StoreItemCard from './store/StoreItemCard';
import StaffIdCard from './dashboard/StaffIdCard';
import PlayerDatabase from './dashboard/PlayerDatabase';
import TurfGround from './dashboard/TurfGround';
import { useStore } from '../../context/StoreContext';

interface StaffDashboardProps {
  user: User;
  onLogout: () => void;
  navigateTo: (page: string) => void;
}

type StaffView = 'overview' | 'payments' | 'matches' | 'bookings' | 'stores' | 'profile' | 'players' | 'turf' | 'auctions';

const API_BASE_URL = 'https://box-cricket-qt23.onrender.com/api';

export function StaffDashboard({ user, onLogout, navigateTo }: StaffDashboardProps) {
  const { storeItems } = useStore();
  const [currentView, setCurrentView] = useState<StaffView>('overview');
  const [matches, setMatches] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [newMatch, setNewMatch] = useState({
    team1: '',
    team2: '',
    sport: 'Cricket',
    venue: 'Grand Cricket Ground'
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [matchesRes, bookingsRes, playersRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/matches`),
        fetch(`${API_BASE_URL}/bookings`),
        fetch(`${API_BASE_URL}/players`),
        fetch(`${API_BASE_URL}/orders`)
      ]);

      const [matchesData, bookingsData, playersData, ordersData] = await Promise.all([
        matchesRes.json(),
        bookingsRes.json(),
        playersRes.json(),
        ordersRes.json()
      ]);

      setMatches(matchesData);
      setBookings(bookingsData);
      setPlayers(playersData);
      setOrders(ordersData.orders || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMatch = async () => {
    if (!newMatch.team1 || !newMatch.team2) return;

    const matchData = {
      turfName: newMatch.venue,
      team1: newMatch.team1,
      team2: newMatch.team2,
      score1: 0,
      score2: 0,
      status: 'live',
      sport: newMatch.sport,
      startTime: newMatch.sport
    };

    try {
      const res = await fetch(`${API_BASE_URL}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(matchData)
      });
      const data = await res.json();
      if (data.success) {
        setMatches([data.match, ...matches]);
        setShowAddMatchModal(false);
        setNewMatch({ team1: '', team2: '', sport: 'Cricket', venue: 'Grand Cricket Ground' });
      }
    } catch (error) {
      console.error('Error adding match:', error);
    }
  };

  const handleDeleteMatch = async (matchId: string | number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setMatches(matches.filter(m => (m._id || m.id) !== matchId));
      }
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  const handleUpdatePaymentStatus = async (bookingId: string, status: 'paid' | 'rejected') => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => 
          (b._id || b.id) === bookingId ? { ...b, paymentStatus: status } : b
        ));
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <ChartLine className="w-5 h-5" /> },
    { id: 'payments', label: 'Assigned Payments', icon: <IndianRupee className="w-5 h-5" /> },
    { id: 'matches', label: 'Ongoing Matches', icon: <Activity className="w-5 h-5" /> },
    { id: 'bookings', label: 'Manage Bookings', icon: <Calendar className="w-5 h-5" /> },
    { id: 'auctions', label: 'Premium Auctions', icon: <Gavel className="w-5 h-5" /> },
    { id: 'stores', label: 'Store Management', icon: <Store className="w-5 h-5" /> },
    { id: 'players', label: 'Player Registry', icon: <Users className="w-5 h-5" /> },
    { id: 'turf', label: 'Turf Ground', icon: <Layout className="w-5 h-5" /> },
  ];

  const assignedBookings = bookings.filter(b => b.paymentStatus !== 'rejected').slice(0, 5);
  const liveMatches = matches.filter(m => m.status === 'live');
  const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Top Header (High Visibility) */}
      <div className="md:hidden flex items-center justify-between p-4 bg-blue-700 text-white sticky top-0 z-[100] shadow-md">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-blue-200" />
          <span className="font-bold text-lg">Staff Portal</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-blue-600 rounded-lg transition-colors border border-blue-500/30"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Modern Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Polished Layout */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-72 bg-blue-100 border-r border-blue-200 flex flex-col z-[120]
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Profile Header (Fixed at top of sidebar) */}
        <div className="p-6 border-b border-blue-200 bg-white/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white font-bold text-xl">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Staff Portal</h2>
              <p className="text-xs text-blue-700 font-black uppercase tracking-widest">{user.name}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Nav Area */}
        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as StaffView);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                currentView === item.id
                  ? 'bg-blue-700 text-white shadow-lg shadow-blue-200 scale-[1.02]'
                  : 'text-slate-600 hover:bg-blue-200 hover:text-slate-900'
              }`}
            >
              <span className={`transition-colors ${currentView === item.id ? 'text-white' : 'text-blue-600 group-hover:text-blue-700'}`}>
                {item.icon}
              </span>
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Action Footer (Sticky at bottom) */}
        <div className="p-4 border-t border-blue-200 bg-slate-50 space-y-1">
          <button
            onClick={() => {
              setCurrentView('profile');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === 'profile'
                ? 'bg-blue-700 text-white shadow-lg'
                : 'text-slate-600 hover:bg-blue-200 hover:text-slate-900'
            }`}
          >
            <UserCircle className={currentView === 'profile' ? 'text-white' : 'text-blue-600'} />
            <span className="font-bold">My ID Card</span>
          </button>
          <button
            onClick={() => {
              navigateTo('home');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-blue-200 hover:text-slate-900 transition-colors"
          >
            <Settings className="text-blue-600" />
            <span className="font-bold">Public Site</span>
          </button>
          <button
            onClick={() => {
              onLogout();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="text-red-500" />
            <span className="font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Content Area Wrap */}
      <main className="flex-1 w-full min-w-0 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {currentView === 'overview' && (
            <div>
              <h1 className="text-3xl mb-6 font-bold">Staff Dashboard</h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-600 font-medium">Active Bookings</p>
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Total in database</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-600 font-medium">Pending Payments</p>
                    <DollarSign className="w-8 h-8 text-yellow-600" />
                  </div>
                  <p className="text-3xl font-bold text-yellow-600">{pendingPayments.length}</p>
                  <p className="text-sm text-gray-500 mt-1">To collect</p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-600 font-medium">Store Revenue</p>
                    <Store className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-600">₹{orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</p>
                  <p className="text-sm text-gray-500 mt-1">{orders.length} online orders</p>
                </div>
              </div>

              {/* Today's Tasks */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl mb-4 font-bold">Recent Bookings</h2>
                <div className="space-y-3">
                  {assignedBookings.map((booking) => (
                    <div key={booking._id || booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold">{booking.turfName}</p>
                        <p className="text-sm text-gray-600">{booking.startTime} - {booking.endTime}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                  {assignedBookings.length === 0 && (
                    <p className="text-gray-500 italic">No bookings found</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentView === 'payments' && (
            <div>
              <h1 className="text-3xl mb-6 font-bold">Assigned Payments</h1>

              {/* Total Paid Summary Card */}
              <div className="bg-green-600 rounded-xl shadow-md p-6 mb-6 text-white flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium uppercase tracking-wider">Total Paid Collected</p>
                  <p className="text-4xl font-bold mt-1">₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' ? sum + (b.totalPrice || 0) : sum, 0).toFixed(2)}</p>
                </div>
                <IndianRupee className="w-12 h-12 text-green-200 opacity-50" />
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking._id || booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold">{booking.turfName}</h3>
                          <p className="text-gray-600 font-medium">{booking.userName}</p>
                          <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString()} - {booking.startTime}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">₹{booking.totalPrice}</p>
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            booking.paymentStatus === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : booking.paymentStatus === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </div>
                      {booking.paymentStatus === 'pending' && (
                        <div className="flex gap-2 mt-3">
                          <button 
                            onClick={() => handleUpdatePaymentStatus(booking._id || booking.id, 'paid')}
                            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-bold shadow-sm"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Accept
                          </button>
                          <button 
                            onClick={() => handleUpdatePaymentStatus(booking._id || booking.id, 'rejected')}
                            className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-bold shadow-sm"
                          >
                            <LogOut className="w-5 h-5" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <p className="text-gray-500 italic text-center py-4">No payments to display</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentView === 'matches' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Monitor Ongoing Matches</h1>
                <button
                  onClick={() => setShowAddMatchModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-bold shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Add Match
                </button>
              </div>

              {/* ADD MATCH MODAL */}
              {showAddMatchModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-5">
                  <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
                    <h2 className="text-xl font-bold mb-5 border-b pb-3">Add Live Match</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Team 1 Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="e.g. Thunder Strikers"
                          value={newMatch.team1}
                          onChange={(e) => setNewMatch({ ...newMatch, team1: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Team 2 Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="e.g. Royal Champions"
                          value={newMatch.team2}
                          onChange={(e) => setNewMatch({ ...newMatch, team2: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Sport</label>
                          <select
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                            value={newMatch.sport}
                            onChange={(e) => setNewMatch({ ...newMatch, sport: e.target.value })}
                          >
                            <option>Cricket</option>
                            <option>Football</option>
                            <option>Basketball</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Venue</label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={newMatch.venue}
                            onChange={(e) => setNewMatch({ ...newMatch, venue: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button
                        onClick={() => setShowAddMatchModal(false)}
                        className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddMatch}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all hover:-translate-y-0.5"
                      >
                        Create Match
                      </button>
                    </div>
                  </div>
                </div>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: "24px",
                }}
              >
                {matches.filter(m => m.status === 'live').map((match) => (
                  <LiveScoreCard
                    key={match._id || match.id}
                    match={match}
                    onUpdateScore={() => fetchData()}
                    onDelete={handleDeleteMatch}
                  />
                ))}
              </div>

              {matches.filter(m => m.status === 'live').length === 0 && (
                <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium font-bold">No live matches at the moment</p>
                  <button onClick={() => setShowAddMatchModal(true)} className="mt-4 text-blue-600 font-bold hover:underline">Add one now</button>
                </div>
              )}
            </div>
          )}

          {currentView === 'bookings' && (
            <div>
              <h1 className="text-3xl mb-6 font-bold">Manage Bookings</h1>
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking._id || booking.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold">{booking.turfName}</h3>
                          <p className="text-gray-600 font-medium">{booking.userName}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.status === 'confirmed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm border-t pt-3 mt-3">
                        <div>
                          <p className="text-gray-500 font-medium">Date</p>
                          <p className="font-bold">{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Time</p>
                          <p className="font-bold">{booking.startTime} - {booking.endTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Payment</p>
                          <p className="font-bold capitalize">{booking.paymentMethod || 'Cash'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 font-medium">Amount</p>
                          <p className="font-bold text-green-600 text-lg">₹{booking.totalPrice}</p>
                        </div>
                      </div>
                      {booking.status === 'pending' && (
                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-bold shadow-sm">
                            Confirm
                          </button>
                          <button className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors font-bold shadow-sm">
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <p className="text-gray-500 italic text-center py-8 font-bold">No bookings recorded yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentView === 'stores' && (
            <div>
              <h1 className="text-3xl mb-6 font-bold">Store Inventory</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storeItems.map((item) => (
                  <StoreItemCard
                    key={item.id}
                    item={item}
                    onUpdate={() => console.log('Updated item:', item.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {currentView === 'profile' && (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl mb-8 font-bold text-gray-800">Staff Identity Card</h1>
              <StaffIdCard user={user} />
            </div>
          )}

          {currentView === 'players' && (
            <div>
              <h1 className="text-3xl mb-8 font-bold text-gray-800">Player Registry</h1>
              <PlayerDatabase 
                players={players} 
                onPlayerAdded={(newPlayer) => setPlayers([newPlayer, ...players])} 
                onPlayerDeleted={(playerId) => setPlayers(players.filter(p => (p._id || p.id) !== playerId))} 
              />
              <button
                onClick={() => fetchData()}
                className="mt-6 flex items-center gap-2 text-blue-600 font-bold hover:underline"
              >
                <Activity className="w-4 h-4" />
                Refresh Registry
              </button>
            </div>
          )}
          {currentView === 'turf' && (
            <TurfGround />
          )}
          {currentView === 'auctions' && (
            <div className="h-full">
              <AuctionSystem currentUser={user} isModal={false} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

