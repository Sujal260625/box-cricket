import { User } from '../../App';
import { useState } from 'react';
import {
  IndianRupee,
  Calendar,
  Trophy,
  Activity,
  ShoppingBag,
  User as UserIcon,
  MessageSquare,
  LogOut,
  Settings,
  Star,
  Clock,
  MapPin,
  CreditCard,
  Package,
  Users,
  Gavel,
  Menu,
  X
} from 'lucide-react';
import { mockTurfs, mockBookings, mockTournaments, mockMatches, mockStoreItems, mockReviews } from '../../data/mockData';
import { OnlineStore } from './store/OnlineStore';
import { ChallengeSystem } from './challenges/ChallengeSystem';
import { BookingCalendar } from '../shared/BookingCalendar';
import { AuctionSystem } from './AuctionSystem';
import { TournamentRegistration } from './tournaments/TournamentRegistration';
import { Booking, bookingService } from '../../services/bookingService';
import { useEffect } from 'react';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
  navigateTo: (page: string) => void;
}

type UserView = 'overview' | 'bookings' | 'tournaments' | 'scores' | 'shop' | 'challenges' | 'profile' | 'reviews' | 'paymentHistory' | 'bookingHistory' | 'my-orders' | 'auction';

export function UserDashboard({ user, onLogout, navigateTo }: UserDashboardProps) {
  const [currentView, setCurrentView] = useState<UserView>('overview');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showStore, setShowStore] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<any | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      const data = await bookingService.getBookings();
      setBookings(data);
    };
    fetchBookings();

    const fetchOrders = async () => {
      const BASE_URL = import.meta.env.VITE_API_URL || '/api';
      try {
        const response = await fetch(`${BASE_URL}/activities`); 
        const orderResp = await fetch(`${BASE_URL}/orders?userId=${user.id}`);
        const data = await orderResp.json();
        setOrders(data.orders || []);
      } catch (e) { console.error(e); }
    };

    fetchOrders();
  }, [user.id]);

  const userUpcomingBookings = bookings.filter(b => b.userName === user.name);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: <Activity className="w-5 h-5" /> },
    { id: 'bookings', label: 'My Bookings', icon: <Calendar className="w-5 h-5" /> },
    { id: 'bookingHistory', label: 'Booking History', icon: <Clock className="w-5 h-5" /> },
    { id: 'paymentHistory', label: 'Payment History', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'tournaments', label: 'Tournaments', icon: <Trophy className="w-5 h-5" /> },
    { id: 'scores', label: 'Live Scores', icon: <Activity className="w-5 h-5" /> },
    { id: 'shop', label: 'Online Store', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'my-orders', label: 'My Orders', icon: <Package className="w-5 h-5" /> },
    { id: 'challenges', label: 'Challenges', icon: <Trophy className="w-5 h-5" /> },
    { id: 'auction', label: 'Gear Auction', icon: <Gavel className="w-5 h-5" /> },
    { id: 'profile', label: 'My Profile', icon: <UserIcon className="w-5 h-5" /> },
    { id: 'reviews', label: 'Reviews', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  // User's bookings
  const userPastBookings = userUpcomingBookings.filter(b => new Date(b.date) < new Date());
  const openTournaments = mockTournaments.filter(t => t.status === 'open');
  const userReviews = mockReviews.filter(r => r.userName === user.name);

  const handleCheckoutComplete = (order: any) => {
    console.log('Order placed:', order);
    // Here you would typically save the order to your backend
  };

  const closeStore = () => {
    setShowStore(false);
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-purple-800 text-white sticky top-0 z-[100] shadow-lg">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-200" />
          <span className="font-bold text-lg">My Dashboard</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-purple-700 rounded-lg transition-colors border border-purple-600/30"
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

      {/* Sidebar - Polished Purple Layout */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-72 bg-purple-700 text-white flex flex-col z-[120]
        transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Profile Branding */}
        <div className="p-6 border-b border-purple-600 bg-purple-800/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-purple-700 font-black text-2xl shadow-inner">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight leading-none">TurfFlow</h2>
              <p className="text-[10px] text-purple-200 mt-1 uppercase tracking-widest font-black opacity-80">{user.name}</p>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as UserView | 'auction');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                currentView === item.id
                  ? 'bg-white text-purple-700 shadow-xl shadow-purple-900/40 scale-[1.02]'
                  : 'text-purple-50 hover:bg-white/10'
              }`}
            >
              <span className={`transition-colors ${currentView === item.id ? 'text-purple-700' : 'text-purple-300 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span className="font-bold tracking-tight">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Footer Actions */}
        <div className="p-4 border-t border-purple-600 bg-purple-900/30 space-y-1">
          <button
            onClick={() => {
              navigateTo('home');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-purple-100 hover:bg-white/10 transition-colors"
          >
            <Settings className="w-5 h-5 text-purple-300" />
            <span className="font-bold">Public Site</span>
          </button>
          <button
            onClick={() => {
              onLogout();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-100 hover:bg-red-500/20 transition-colors"
          >
            <LogOut className="w-5 h-5 text-red-300" />
            <span className="font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full min-w-0 bg-gray-50 flex flex-col h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {currentView === 'overview' && (
              <div>
                <h1 className="text-3xl mb-6">Welcome back, {user.name}!</h1>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600">Active Bookings</p>
                      <Calendar className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{userUpcomingBookings.length}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600">Tournaments Joined</p>
                      <Trophy className="w-8 h-8 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">2</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600">Reviews Written</p>
                      <MessageSquare className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">{userReviews.length}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                  <h2 className="text-xl mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                      onClick={() => setCurrentView('bookings')}
                      className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-600 transition-colors text-center"
                    >
                      <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="font-medium">Book a Turf</p>
                    </button>
                    <button
                      onClick={() => setCurrentView('challenges')}
                      className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-600 transition-colors text-center"
                    >
                      <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="font-medium">Join Challenge</p>
                    </button>
                    <button
                      onClick={() => setCurrentView('scores')}
                      className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-600 transition-colors text-center"
                    >
                      <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="font-medium">View Live Scores</p>
                    </button>
                    <button
                      onClick={() => setCurrentView('shop')}
                      className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-600 transition-colors text-center"
                    >
                      <ShoppingBag className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="font-medium">Browse Store</p>
                    </button>
                  </div>
                </div>

                {/* Upcoming Bookings */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl mb-4">Upcoming Bookings</h2>
                  {userUpcomingBookings.length > 0 ? (
                    <div className="space-y-3">
                      {userUpcomingBookings.map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{booking.turfName}</p>
                            <p className="text-sm text-gray-600">{booking.date} - {booking.startTime} to {booking.endTime}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm ${booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {booking.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No upcoming bookings</p>
                  )}
                </div>
              </div>
            )}

            {currentView === 'bookings' && (
              <BookingCalendar user={user} onBookingComplete={async () => {
                const data = await bookingService.getBookings();
                setBookings(data);
              }} />
            )}

            {currentView === 'bookingHistory' && (
              <div>
                <h1 className="text-3xl mb-6">Booking History</h1>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="space-y-4">
                    {userPastBookings.length > 0 ? (
                      userPastBookings.map((booking) => (
                        <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-medium">{booking.turfName}</h3>
                              <p className="text-gray-600">{booking.date}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                              Completed
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-500">Time Slot</p>
                              <p className="font-medium">{booking.startTime} - {booking.endTime}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Status</p>
                              <p className="font-medium text-purple-600 capitalize">{booking.status}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Payment</p>
                              <p className="font-medium capitalize text-emerald-600">{booking.paymentMethod || 'cash'}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No booking history available</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'paymentHistory' && (
              <div>
                <h1 className="text-3xl mb-6">Payment History</h1>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left">Booking ID</th>
                          <th className="px-4 py-3 text-left">Turf</th>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-left">Amount</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Payment Method</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.filter(b => b.userName === user.name).map((booking) => (
                          <tr key={booking.id} className="border-b border-gray-200">
                            <td className="px-4 py-3">#{booking.id?.slice(-4)}</td>
                            <td className="px-4 py-3">{booking.turfName}</td>
                            <td className="px-4 py-3">{booking.date}</td>
                            <td className="px-4 py-3 font-medium text-green-600">₹500</td>
                            <td className="px-4 py-3">
                              <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                                paid
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium capitalize text-blue-600">
                              {booking.paymentMethod || 'cash'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'tournaments' && (
              <div>
                <h1 className="text-3xl mb-6">Challenges & Tournaments</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {openTournaments.map((tournament) => (
                    <div key={tournament.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div
                        className="h-40 bg-cover bg-center"
                        style={{ backgroundImage: `url('${tournament.image}')` }}
                      />
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl">{tournament.name}</h3>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            {tournament.status}
                          </span>
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Trophy className="w-4 h-4 mr-2" />
                            <span className="text-sm">{tournament.sport}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="text-sm">{tournament.startDate} to {tournament.endDate}</span>
                          </div>
                          <div className="flex items-center text-green-600 font-medium">
                            <IndianRupee className="w-4 h-4 mr-2" />
                            <span className="text-sm">Prize: {tournament.prize}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedTournament(tournament);
                            setShowRegistration(true);
                          }}
                          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Register Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'scores' && (
              <div>
                <h1 className="text-3xl mb-6">Live Match Scores</h1>
                <div className="space-y-4">
                  {mockMatches.filter(m => m.status === 'live').map((match) => (
                    <div key={match.id} className="bg-white rounded-xl shadow-md p-6 border-2 border-red-500">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm animate-pulse">
                          ● LIVE
                        </span>
                        <span className="text-sm text-gray-600">{match.turfName}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div className="text-center">
                          <p className="text-lg font-medium mb-2">{match.team1}</p>
                          <p className="text-4xl font-bold text-green-600">{match.score1}</p>
                        </div>
                        <div className="text-center text-gray-400">VS</div>
                        <div className="text-center">
                          <p className="text-lg font-medium mb-2">{match.team2}</p>
                          <p className="text-4xl font-bold text-green-600">{match.score2}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === 'challenges' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl">Challenges & Competitions</h1>
                  <button
                    onClick={() => setShowChallenges(true)}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Create Challenge
                  </button>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl mb-4">Available Challenges</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium">Box Cricket Challenge</h4>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                          Open
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Trophy className="w-4 h-4 mr-1" />
                        <span>Cricket</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Jan 10, 2026 at 15:00</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>Elite Football Arena</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Users className="w-4 h-4 mr-1" />
                        <span>4/12 participants</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <div className="flex items-center text-sm">
                            <IndianRupee className="w-4 h-4 mr-1 text-green-600" />
                            <span className="font-medium text-green-600">Entry: ₹200</span>
                          </div>
                          <div className="text-sm text-purple-600 font-medium">Prize: ₹5000</div>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm text-gray-600">4.7</span>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
                        Join Challenge
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium">Football Frenzy</h4>
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                          Open
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Trophy className="w-4 h-4 mr-1" />
                        <span>Football</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Jan 12, 2026 at 17:00</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>Grand Cricket Ground</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Users className="w-4 h-4 mr-1" />
                        <span>2/10 participants</span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <div className="flex items-center text-sm">
                            <IndianRupee className="w-4 h-4 mr-1 text-green-600" />
                            <span className="font-medium text-green-600">Entry: ₹300</span>
                          </div>
                          <div className="text-sm text-purple-600 font-medium">Prize: ₹8000</div>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm text-gray-600">4.5</span>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
                        Join Challenge
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'shop' && (
              <OnlineStore
                currentUser={user}
                onCheckoutComplete={handleCheckoutComplete}
                isModal={false}
              />
            )}

            {currentView === 'profile' && (
              <div>
                <h1 className="text-3xl mb-6">My Profile</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Card */}
                  <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6">
                    <div className="flex flex-col items-center mb-6">
                      <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-white text-4xl mb-4">
                        {user.name.charAt(0)}
                      </div>
                      <h2 className="text-2xl mb-1">{user.name}</h2>
                      <p className="text-gray-600">{user.email}</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <UserIcon className="w-5 h-5 text-purple-600 mr-3" />
                        <span className="text-gray-700">John Player</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-purple-600 mr-3" />
                        <span className="text-gray-700">Mumbai, India</span>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <CreditCard className="w-5 h-5 text-purple-600 mr-3" />
                        <span className="text-gray-700">**** 4829</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl mb-4">Personal Information</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-2 text-gray-700">First Name</label>
                          <input
                            type="text"
                            defaultValue={user.name.split(' ')[0] || user.name}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2 text-gray-700">Last Name</label>
                          <input
                            type="text"
                            defaultValue={user.name.split(' ')[1] || ''}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-700">Email</label>
                        <input
                          type="email"
                          defaultValue={user.email}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-700">Phone</label>
                        <input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-700">Address</label>
                        <input
                          type="text"
                          placeholder="123 Main St, Mumbai"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-700">Preferences</label>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">Football</span>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Cricket</span>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">Weekend</span>
                        </div>
                      </div>
                      <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        Save Changes
                      </button>
                    </div>

                    <div className="border-t border-gray-200 pt-6 mt-6">
                      <h2 className="text-xl mb-4">Account Security</h2>
                      <div className="space-y-4">
                        <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          Change Password
                        </button>
                        <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          Manage Payment Methods
                        </button>
                        <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                          Privacy Settings
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'reviews' && (
              <div>
                <h1 className="text-3xl mb-6">Submit Reviews & Feedback</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Write Review Form */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl mb-4">Write a Review</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm mb-2 text-gray-700">Select Turf</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                          <option>Choose a turf...</option>
                          {mockTurfs.map((turf) => (
                            <option key={turf.id} value={turf.id}>{turf.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-700">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              className="hover:scale-110 transition-transform"
                            >
                              <Star className="w-8 h-8 text-gray-300 hover:text-yellow-400 fill-gray-300 hover:fill-yellow-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm mb-2 text-gray-700">Your Review</label>
                        <textarea
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Share your experience..."
                        />
                      </div>
                      <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        Submit Review
                      </button>
                    </div>
                  </div>

                  {/* My Reviews */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl mb-4">My Reviews</h2>
                    <div className="space-y-4">
                      {userReviews.length > 0 ? (
                        userReviews.map((review) => (
                          <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{review.turfName}</h3>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{review.date}</p>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No reviews yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {currentView === 'my-orders' && (
              <div>
                <h1 className="text-3xl mb-6">My Orders</h1>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="space-y-4">
                    {orders && orders.length > 0 ? (
                      orders.map((order: any) => (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-lg font-medium">Order #{order._id.slice(-6)}</h3>
                              <p className="text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</p>
                            </div>
                            <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700 capitalize">
                              {order.status}
                            </span>
                          </div>
                          <div className="space-y-2 mb-3">
                            {order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between text-sm">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="border-t pt-2 flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-green-600">₹{order.total}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">No orders found</p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {currentView === 'auction' && (
              <AuctionSystem
                currentUser={user}
                isModal={false}
              />
            )}
          </div>
        </main>
      </div>

      {showStore && (
        <OnlineStore
          currentUser={user}
          onCheckoutComplete={handleCheckoutComplete}
          onClose={closeStore}
        />
      )}

      {showRegistration && selectedTournament && (
        <TournamentRegistration
          tournament={selectedTournament}
          currentUser={user}
          onRegistrationComplete={(reg) => {
            console.log('Registered', reg);
            setShowRegistration(false);
          }}
          onClose={() => setShowRegistration(false)}
        />
      )}

      {showChallenges && (
        <ChallengeSystem
          currentUser={user}
          onClose={() => setShowChallenges(false)}
        />
      )}
    </>
  );
}
