import React, { useState } from 'react';
import { User } from '../../App';
import {
  IndianRupee,
  Clock,
  Download,
  Filter,
  AlertTriangle,
  Package,
  Calendar,
  Activity,
  MapPin,
  Store,
  Settings,
  LogOut,
  TrendingUp,
  BarChart3,
  Gavel,
  Menu,
  X
} from 'lucide-react';
import { AuctionSystem } from '../user/AuctionSystem';
import { mockBookings, mockMatches, mockStaff, mockStoreItems, mockTurfs } from '../../data/mockData';
import { StaffLocationTracker } from './StaffLocationTracker';
import { BookingConflictDetector } from './BookingConflictDetector';
import { InventoryManagement } from './InventoryManagement';
import { ExportReports } from './ExportReports';
import { Booking, bookingService } from '../../services/bookingService';
import { useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
  navigateTo: (page: string) => void;
}

type AdminView = 'overview' | 'payments' | 'matches' | 'bookings' | 'conflicts' | 'staff' | 'stores' | 'turfs' | 'analytics' | 'reports' | 'export' | 'inventory' | 'auctions';

export function AdminDashboard({ user, onLogout, navigateTo }: AdminDashboardProps) {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [showStaffTracker, setShowStaffTracker] = useState(false);
  const [showBookingConflictDetector, setShowBookingConflictDetector] = useState(false);
  const [showExportReports, setShowExportReports] = useState(false);
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bRes = await bookingService.getBookings();
        setBookings(bRes);

        const oResp = await fetch('/api/orders');
        const oData = await oResp.json();
        setOrders(oData.orders || []);

        const aResp = await fetch('/api/activities');
        const aData = await aResp.json();
        setActivities(aData || []);

        const iResp = await fetch('/api/inventory');
        const iData = await iResp.json();
        setInventory(iData || []);
      } catch (e) {
        console.error('Fetch error:', e);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000); // Live refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const closeStaffTracker = () => {
    setShowStaffTracker(false);
  };

  const menuItems: { id: string; label: string; icon: React.ReactNode; action?: () => void }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <Download className="w-5 h-5" /> },
    { id: 'payments', label: 'Payment Analytics', icon: <IndianRupee className="w-5 h-5" /> },
    { id: 'matches', label: 'Ongoing Matches', icon: <Activity className="w-5 h-5" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
    { id: 'conflicts', label: 'Booking Conflicts', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'inventory', label: 'Inventory Management', icon: <Package className="w-5 h-5" /> },
    { id: 'auctions', label: 'Premium Auctions', icon: <Gavel className="w-5 h-5" /> },
    { id: 'export', label: 'Export Reports', icon: <Download className="w-5 h-5" /> },
    { id: 'staff', label: 'Staff Tracking', icon: <MapPin className="w-5 h-5" /> },
    { id: 'stores', label: 'Store Management', icon: <Store className="w-5 h-5" /> },
    { id: 'turfs', label: 'Turf Management', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleUpdatePaymentStatus = async (bookingId: string, status: 'paid' | 'rejected') => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}/payment`, {
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

  // Calculate statistics
  const totalRevenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + (b.totalPrice || 500), 0);
  const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending').reduce((sum, b) => sum + (b.totalPrice || 500), 0);
  const liveMatches = mockMatches.filter(m => m.status === 'live').length;
  const totalBookings = bookings.filter(b => b.paymentStatus !== 'rejected').length;

  // Calculate additional analytics
  const bookingTrend = useMemo(() => [
    { day: 'Mon', count: bookings.filter(b => b.paymentStatus !== 'rejected' && new Date(b.date).getDay() === 1).length },
    { day: 'Tue', count: bookings.filter(b => b.paymentStatus !== 'rejected' && new Date(b.date).getDay() === 2).length },
    { day: 'Wed', count: bookings.filter(b => b.paymentStatus !== 'rejected' && new Date(b.date).getDay() === 3).length },
    { day: 'Thu', count: bookings.filter(b => b.paymentStatus !== 'rejected' && new Date(b.date).getDay() === 4).length },
    { day: 'Fri', count: bookings.filter(b => b.paymentStatus !== 'rejected' && new Date(b.date).getDay() === 5).length },
    { day: 'Sat', count: bookings.filter(b => b.paymentStatus !== 'rejected' && new Date(b.date).getDay() === 6).length },
    { day: 'Sun', count: bookings.filter(b => b.paymentStatus !== 'rejected' && new Date(b.date).getDay() === 0).length },
  ], [bookings]);

  const revenueData = useMemo(() => [
    { name: 'Mon', revenue: bookings.filter(b => b.paymentStatus === 'paid' && new Date(b.date).getDay() === 1).reduce((sum, b) => sum + (b.totalPrice || 500), 0) },
    { name: 'Tue', revenue: bookings.filter(b => b.paymentStatus === 'paid' && new Date(b.date).getDay() === 2).reduce((sum, b) => sum + (b.totalPrice || 500), 0) },
    { name: 'Wed', revenue: bookings.filter(b => b.paymentStatus === 'paid' && new Date(b.date).getDay() === 3).reduce((sum, b) => sum + (b.totalPrice || 500), 0) },
    { name: 'Thu', revenue: bookings.filter(b => b.paymentStatus === 'paid' && new Date(b.date).getDay() === 4).reduce((sum, b) => sum + (b.totalPrice || 500), 0) },
    { name: 'Fri', revenue: bookings.filter(b => b.paymentStatus === 'paid' && new Date(b.date).getDay() === 5).reduce((sum, b) => sum + (b.totalPrice || 500), 0) },
    { name: 'Sat', revenue: bookings.filter(b => b.paymentStatus === 'paid' && new Date(b.date).getDay() === 6).reduce((sum, b) => sum + (b.totalPrice || 500), 0) },
    { name: 'Sun', revenue: bookings.filter(b => b.paymentStatus === 'paid' && new Date(b.date).getDay() === 0).reduce((sum, b) => sum + (b.totalPrice || 500), 0) },
  ], [bookings]);


  const revenueByTurf = mockTurfs.map(turf => {
    const turfRevenue = bookings
      .filter(b => b.turfName === turf.name && b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + (b.totalPrice || 500), 0);
    return { name: turf.name, revenue: turfRevenue };
  });

  const revenueByStore = [
    { name: 'Food Store', revenue: orders.filter(o => o.items.some((i: any) => i.category === 'food')).reduce((sum, o) => sum + o.total, 0) },
    { name: 'Sports Store', revenue: orders.filter(o => o.items.some((i: any) => (i.category || '').toLowerCase().includes('sport'))).reduce((sum, o) => sum + o.total, 0) },
  ];

  const bookingDistribution = useMemo(() => {
    if (bookings.length === 0) return { morning: 0, afternoon: 0, evening: 0, night: 0 };
    const morning = bookings.filter(b => { const h = parseInt(b.startTime.split(':')[0]); return h >= 9 && h < 12; }).length;
    const afternoon = bookings.filter(b => { const h = parseInt(b.startTime.split(':')[0]); return h >= 12 && h < 16; }).length;
    const evening = bookings.filter(b => { const h = parseInt(b.startTime.split(':')[0]); return h >= 16 && h < 20; }).length;
    const night = bookings.filter(b => { const h = parseInt(b.startTime.split(':')[0]); return h >= 20 || h < 9; }).length;

    const pct = (val: number) => Math.round((val / bookings.length) * 100);
    return {
      morning: pct(morning),
      afternoon: pct(afternoon),
      evening: pct(evening),
      night: pct(night)
    };
  }, [bookings]);

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Mobile Header (Only visible on mobile) */}
        <div className="md:hidden flex items-center justify-between p-4 bg-green-700 text-white sticky top-0 z-[100] shadow-md">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-200" />
            <span className="font-bold text-lg">TurfFlow Admin</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-green-600 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Backdrop (Only visible on mobile when menu is open) */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-0 left-0 h-screen w-72 bg-green-700 text-white flex flex-col z-[120]
          transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          {/* Logo Section (Desktop Only) */}
          <div className="p-6 border-b border-green-600 hidden md:flex items-center gap-3">
            <Activity className="w-8 h-8 text-green-300" />
            <div>
              <h2 className="text-xl font-bold leading-none">TurfFlow</h2>
              <p className="text-xs text-green-300 mt-1 uppercase tracking-wider font-bold">Admin Portal</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setCurrentView(item.id as AdminView);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    currentView === item.id && !item.action
                      ? 'bg-white/15 text-white shadow-lg ring-1 ring-white/20'
                      : 'hover:bg-white/10 text-green-50'
                  }`}
                >
                  <span className={`${currentView === item.id && !item.action ? 'text-green-300' : 'text-green-200 group-hover:text-white'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Footer Navigation */}
          <div className="p-4 border-t border-green-600 space-y-1 bg-green-800/40">
            <div className="px-4 py-2 mb-2">
              <p className="text-xs text-green-300 font-bold uppercase tracking-widest">{user.name}</p>
            </div>
            <button
              onClick={() => {
                navigateTo('home');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-green-50 transition-colors"
            >
              <Settings className="w-5 h-5 text-green-200" />
              <span className="font-medium">Public Site</span>
            </button>
            <button
              onClick={() => {
                onLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/20 text-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5 text-red-300" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full min-w-0 bg-gray-50 flex flex-col h-screen overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {currentView === 'overview' && (
              <div>
                <h1 className="text-3xl mb-6">Dashboard Overview</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600">Total Revenue</p>
                      <IndianRupee className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">₹{totalRevenue}</p>
                    <p className="text-sm text-gray-500 mt-1">This month</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600">Pending Payments</p>
                      <Clock className="w-8 h-8 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">₹{pendingPayments}</p>
                    <p className="text-sm text-gray-500 mt-1">{mockBookings.filter(b => b.paymentStatus === 'pending').length} bookings</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600">Live Matches</p>
                      <Activity className="w-8 h-8 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-red-600">{liveMatches}</p>
                    <p className="text-sm text-gray-500 mt-1">Currently ongoing</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600">Total Bookings</p>
                      <Calendar className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{totalBookings}</p>
                    <p className="text-sm text-gray-500 mt-1">This month</p>
                  </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Booking Trend Chart */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl mb-4">Booking Trend</h2>
                    <div className="h-64 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={bookingTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                          />
                          <Tooltip
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                            cursor={{ fill: '#f9fafb' }}
                          />
                          <Bar
                            dataKey="count"
                            fill="#16a34a"
                            radius={[6, 6, 0, 0]}
                            barSize={32}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Revenue by Turf */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl mb-4">Revenue by Turf</h2>
                    <div className="h-64 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickFormatter={(value) => `₹${value}`}
                          />
                          <Tooltip
                            formatter={(value) => [`₹${value}`, 'Revenue']}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#16a34a"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            strokeWidth={4}
                            dot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Real-Time Monitoring Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Bookings */}
                  <div className="bg-white rounded-xl shadow-md p-6 h-[400px] flex flex-col">
                    <h2 className="text-xl mb-4 font-bold flex items-center justify-between">
                      <span>Recent Bookings</span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Live</span>
                    </h2>
                    <div className="space-y-3 overflow-y-auto pr-2 flex-1">
                      {bookings.slice().reverse().slice(0, 10).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:shadow-sm transition-shadow border border-gray-100">
                          <div>
                            <p className="font-bold text-gray-800">{booking.turfName}</p>
                            <p className="text-xs text-gray-500 font-medium">{booking.userName} • {booking.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-green-600">₹500</p>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-green-100 text-green-700 font-bold uppercase">
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {bookings.length === 0 && <p className="text-center text-gray-400 py-10 italic">No bookings found</p>}
                    </div>
                  </div>

                  {/* System Activity Feed */}
                  <div className="bg-white rounded-xl shadow-md p-6 h-[400px] flex flex-col border-2 border-blue-50">
                    <h2 className="text-xl mb-4 font-bold flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      System Activity Log
                    </h2>
                    <div className="space-y-4 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-gray-200">
                      {activities.map((act) => (
                        <div key={act._id} className="flex gap-4 p-3 border-l-4 border-blue-500 bg-blue-50/30 rounded-r-lg relative">
                          <div className="text-xs text-blue-600 font-bold whitespace-nowrap pt-1">
                            {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-800">
                              <span className="text-blue-700">{act.userName}</span> {act.action.replace(/_/g, ' ')}
                            </p>
                            <p className="text-[11px] text-gray-500 font-medium truncate">
                              {JSON.stringify(act.details)}
                            </p>
                          </div>
                        </div>
                      ))}
                      {activities.length === 0 && <p className="text-center text-gray-400 py-10 italic">Waiting for activity...</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'analytics' && (
              <div>
                <h1 className="text-3xl mb-6">Advanced Analytics</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Revenue by Store */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl mb-4">Revenue by Store</h2>
                    <div className="space-y-4">
                      {revenueByStore.map((store, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">{store.name}</span>
                            <span className="text-sm font-medium">₹{store.revenue}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${Math.min(100, (store.revenue / Math.max(...revenueByStore.map(s => s.revenue))) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Staff Performance */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl mb-4">Staff Performance</h2>
                    <div className="space-y-4">
                      {mockStaff.map((staff, index) => (
                        <div key={index}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">{staff.name}</span>
                            <span className="text-sm font-medium">{staff.assignedTurf ? 'Assigned' : 'Unassigned'}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-purple-600 h-2.5 rounded-full"
                              style={{ width: staff.assignedTurf ? '80%' : '30%' }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Booking Distribution */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl mb-4">Booking Distribution by Time</h2>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{bookingDistribution.morning}%</div>
                      <div className="text-sm text-gray-600">Morning (9AM-12PM)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{bookingDistribution.afternoon}%</div>
                      <div className="text-sm text-gray-600">Afternoon (12PM-4PM)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{bookingDistribution.evening}%</div>
                      <div className="text-sm text-gray-600">Evening (4PM-8PM)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{bookingDistribution.night}%</div>
                      <div className="text-sm text-gray-600">Night (8PM-11PM)</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'reports' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl">Reports & Analytics</h1>
                  <div className="flex gap-3">
                    <select
                      value={reportPeriod}
                      onChange={(e) => setReportPeriod(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                      <Download className="w-4 h-4" />
                      Export Report
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl mb-4">Revenue Report</h2>
                    <div className="h-48 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData.slice(0, 4)}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" hide />
                          <YAxis hide />
                          <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                          <Area type="monotone" dataKey="revenue" stroke="#15803d" fill="#15803d" fillOpacity={0.1} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-lg font-bold text-green-600">₹{totalRevenue} Total</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl mb-4">Booking Report</h2>
                    <div className="h-48 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={bookingTrend}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="day" hide />
                          <YAxis hide />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-lg font-bold text-blue-600">{totalBookings} Total</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl mb-4">Store Performance</h2>
                    <div className="h-48 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={revenueByStore}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="revenue"
                          >
                            <Cell fill="#eab308" />
                            <Cell fill="#a855f7" />
                          </Pie>
                          <Tooltip formatter={(value) => `₹${value}`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-lg font-bold text-yellow-600">₹{revenueByStore.reduce((sum, store) => sum + store.revenue, 0)} Total</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h2 className="text-xl mb-4">Detailed Reports</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <h3 className="font-medium mb-2">Revenue Report</h3>
                      <p className="text-sm text-gray-600">Detailed breakdown of income by turf and store</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                      <h3 className="font-medium mb-2">Booking Report</h3>
                      <p className="text-sm text-gray-600">Booking trends and patterns analysis</p>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-500 text-left">
                      <h3 className="font-medium mb-2">Staff Report</h3>
                      <p className="text-sm text-gray-600">Performance metrics for all staff members</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'payments' && (
              <div>
                <h1 className="text-3xl mb-6">Payment Analytics</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
                    <p className="text-gray-600 mb-2 font-bold uppercase text-xs tracking-wider">Total Collected</p>
                    <p className="text-3xl font-black text-green-600">₹{bookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + (b.totalPrice || 0), 0) + orders.reduce((sum, o) => sum + (o.total || 0), 0)}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
                    <p className="text-gray-600 mb-2 font-bold uppercase text-xs tracking-wider">Pending Amount</p>
                    <p className="text-3xl font-black text-yellow-600">₹{bookings.filter(b => b.paymentStatus === 'pending').reduce((sum, b) => sum + (b.totalPrice || 0), 0)}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
                    <p className="text-gray-600 mb-2 font-bold uppercase text-xs tracking-wider">Refunded</p>
                    <p className="text-3xl font-black text-red-600">₹0</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h2 className="text-xl mb-4 font-bold flex items-center gap-2">
                    <div className="w-2 h-6 bg-green-600 rounded-full"></div>
                    Real-Time Payment History
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-black">
                        <tr>
                          <th className="px-4 py-3 text-left">#</th>
                          <th className="px-4 py-3 text-left">Turf</th>
                          <th className="px-4 py-3 text-left">Customer</th>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-left">Amount</th>
                          <th className="px-4 py-3 text-left">Status</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {bookings.map((booking, idx) => (
                          <tr key={booking._id || booking.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-bold text-gray-400">{idx + 1}</td>
                            <td className="px-4 py-3 font-bold text-gray-800">{booking.turfName}</td>
                            <td className="px-4 py-3 font-medium text-gray-600">{booking.userName}</td>
                            <td className="px-4 py-3 text-gray-500">{booking.date}</td>
                            <td className="px-4 py-3 font-black text-green-600">₹{booking.totalPrice}</td>
                            <td className="px-4 py-3">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                booking.paymentStatus === 'paid'
                                  ? 'bg-green-100 text-green-700 border border-green-200'
                                  : booking.paymentStatus === 'rejected'
                                  ? 'bg-red-100 text-red-700 border border-red-200'
                                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              }`}>
                                {booking.paymentStatus || 'pending'}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {booking.paymentStatus === 'pending' && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleUpdatePaymentStatus(booking._id || booking.id!, 'paid')}
                                    className="px-2 py-1 bg-green-600 text-white text-[10px] rounded font-bold hover:bg-green-700"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => handleUpdatePaymentStatus(booking._id || booking.id!, 'rejected')}
                                    className="px-2 py-1 bg-red-600 text-white text-[10px] rounded font-bold hover:bg-red-700"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                        {bookings.length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-4 py-10 text-center text-gray-400 italic">No real-time payments recorded</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'matches' && (
              <div>
                <h1 className="text-3xl mb-6">Ongoing Matches</h1>
                <div className="space-y-4">
                  {mockMatches.filter(m => m.status === 'live').map((match) => (
                    <div key={match.id} className="bg-white rounded-xl shadow-md p-6 border-2 border-red-500">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm animate-pulse">
                            ● LIVE
                          </span>
                          <p className="text-gray-600 mt-2">{match.turfName}</p>
                        </div>
                        <span className="text-lg font-medium">{match.sport}</span>
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

                  {mockMatches.filter(m => m.status === 'live').length === 0 && (
                    <p className="text-center text-gray-500 py-8">No live matches at the moment</p>
                  )}
                </div>
              </div>
            )}

            {currentView === 'bookings' && (
              <div>
                <h1 className="text-3xl mb-6">Booking Management</h1>
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="space-y-4">
                    {bookings.slice().reverse().map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-medium">{booking.turfName}</h3>
                            <p className="text-gray-600">{booking.userName}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                            {booking.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-gray-500">Date</p>
                            <p className="font-medium">{booking.date}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Time</p>
                            <p className="font-medium">{booking.startTime} - {booking.endTime}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Duration</p>
                            <p className="font-medium">1h</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Amount</p>
                            <p className="font-medium text-green-600">₹500</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Payment</p>
                            <p className="font-medium capitalize text-blue-600">{booking.paymentMethod || 'cash'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentView === 'conflicts' && (
              <BookingConflictDetector
                currentUser={user}
                isModal={false}
              />
            )}

            {currentView === 'staff' && (
              <StaffLocationTracker
                currentUser={user}
                isModal={false}
              />
            )}

            {currentView === 'export' && (
              <ExportReports
                currentUser={user}
                isModal={false}
                bookings={bookings}
                orders={orders}
                activities={activities}
              />
            )}

            {currentView === 'auctions' && (
              <div className="h-full">
                <AuctionSystem currentUser={user} isModal={false} />
              </div>
            )}

            {currentView === 'inventory' && (
              <InventoryManagement
                currentUser={user}
                isModal={false}
              />
            )}

            {currentView === 'stores' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl">Store & Inventory Governance</h1>
                  <button
                    onClick={() => setCurrentView('inventory')}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-bold shadow-lg"
                  >
                    Open Master Inventory Control
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Sales Summary */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <IndianRupee className="w-6 h-6 text-green-600" />
                      Recent Store Sales
                    </h2>
                    <div className="space-y-4 max-h-96 overflow-auto">
                      {orders.length > 0 ? orders.map((o: any) => (
                        <div key={o._id} className="p-3 border rounded-lg bg-gray-50 flex justify-between items-center">
                          <div>
                            <p className="font-bold">{o.userName}</p>
                            <p className="text-xs text-gray-500">{new Date(o.orderDate).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-green-600 font-bold">₹{o.total}</p>
                            <p className="text-[10px] text-blue-600 uppercase">{o.status}</p>
                          </div>
                        </div>
                      )) : <p className="text-gray-400 italic">No sales recorded yet.</p>}
                    </div>
                  </div>

                  {/* Operational Health */}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Package className="w-6 h-6 text-blue-600" />
                      Inventory Health Check
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                        <p className="text-xs text-red-600 font-bold uppercase">Out of Stock</p>
                        <p className="text-3xl font-black text-red-700">{inventory.filter(i => i.quantity === 0).length}</p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                        <p className="text-xs text-yellow-600 font-bold uppercase">Low Stock Alert</p>
                        <p className="text-3xl font-black text-yellow-700">{inventory.filter(i => i.quantity > 0 && i.quantity < 10).length}</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-600 font-bold uppercase">Total Items (inv)</p>
                        <p className="text-3xl font-black text-blue-700">{inventory.length}</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <p className="text-xs text-green-600 font-bold uppercase">Live Sales Orders</p>
                        <p className="text-3xl font-black text-green-700">{orders.length}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentView === 'turfs' && (
              <div>
                <h1 className="text-3xl mb-6">Turf & Facility Management</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockTurfs.map((turf) => (
                    <div key={turf.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url('${turf.image}')` }}
                      />
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl">{turf.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm ${turf.availability === 'Available'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {turf.availability}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{turf.location}</p>
                        <p className="text-gray-600 mb-3">{turf.type}</p>
                        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                          <p className="text-2xl font-bold text-green-600">₹{turf.pricePerHour}/hr</p>
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {showStaffTracker && (
        <StaffLocationTracker
          currentUser={user}
          onClose={closeStaffTracker}
        />
      )}

      {showBookingConflictDetector && (
        <BookingConflictDetector
          currentUser={user}
          onClose={() => setShowBookingConflictDetector(false)}
        />
      )}

      {showExportReports && (
        <ExportReports
          currentUser={user}
          onClose={() => setShowExportReports(false)}
        />
      )}
    </>
  );
}
