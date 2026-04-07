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
  Layout
} from 'lucide-react';
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

type StaffView = 'overview' | 'payments' | 'matches' | 'bookings' | 'stores' | 'profile' | 'players' | 'turf';

const API_BASE_URL = 'https://box-cricket-qt23.onrender.com/api';

export function StaffDashboard({ user, onLogout, navigateTo }: StaffDashboardProps) {
  const { storeItems } = useStore();
  const [currentView, setCurrentView] = useState<StaffView>('overview');
  const [matches, setMatches] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [newMatch, setNewMatch] = useState({
    team1: '',
    team2: '',
    sport: 'Cricket',
    venue: 'Grand Cricket Ground'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [matchesRes, bookingsRes, playersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/matches`),
        fetch(`${API_BASE_URL}/bookings`),
        fetch(`${API_BASE_URL}/players`)
      ]);

      const [matchesData, bookingsData, playersData] = await Promise.all([
        matchesRes.json(),
        bookingsRes.json(),
        playersRes.json()
      ]);

      setMatches(matchesData);
      setBookings(bookingsData);
      setPlayers(playersData);
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

  const handleUpdatePaymentStatus = async (bookingId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/payment`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        setBookings(prev => prev.map(b => 
          (b._id || b.id) === bookingId ? { ...b, paymentStatus: 'paid' } : b
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
    { id: 'stores', label: 'Store Management', icon: <Store className="w-5 h-5" /> },
    { id: 'players', label: 'Player Registry', icon: <Users className="w-5 h-5" /> },
    { id: 'turf', label: 'Turf Ground', icon: <Layout className="w-5 h-5" /> },
  ];

  const assignedBookings = bookings.slice(0, 5);
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 border-b border-blue-600">
          <h2 className="text-2xl mb-1">Staff Portal</h2>
          <p className="text-sm text-blue-200">{user.name}</p>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as StaffView)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                currentView === item.id
                  ? 'bg-blue-600'
                  : 'hover:bg-blue-600/50'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-600">
          <button
            onClick={() => setCurrentView('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              currentView === 'profile'
                ? 'bg-blue-600'
                : 'hover:bg-blue-600/50'
            }`}
          >
            <UserCircle className="w-5 h-5" />
            <span>My ID Card</span>
          </button>
          <button
            onClick={() => navigateTo('home')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors mb-2"
          >
            <Settings className="w-5 h-5" />
            <span>Public Site</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
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
                    <p className="text-gray-600 font-medium">Live Matches</p>
                    <Activity className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-3xl font-bold text-red-600">{liveMatches.length}</p>
                  <p className="text-sm text-gray-500 mt-1">Ongoing now</p>
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
                  <p className="text-4xl font-bold mt-1">₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' ? sum + b.totalPrice : sum, 0)}</p>
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
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold uppercase ${booking.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </div>
                      {booking.paymentStatus === 'pending' && (
                        <button 
                          onClick={() => handleUpdatePaymentStatus(booking._id || booking.id)}
                          className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-bold shadow-sm"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Mark as Paid
                        </button>
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
        </div>
      </div>
    </div>
  );
}

