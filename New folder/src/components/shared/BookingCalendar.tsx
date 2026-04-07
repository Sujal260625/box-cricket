import React, { useState, useEffect } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';

import { Filter, Plus, Clock, X, Loader2, CreditCard, Banknote, CheckCircle2, Activity } from 'lucide-react';
import { bookingService, Booking } from '../../services/bookingService';
import { User } from '../../App';

interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    bookedBy?: string;
}

type PaymentMethod = 'cash' | 'online';

interface BookingCalendarProps {
    user: User;
    onBookingComplete?: () => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({ user, onBookingComplete }) => {
    // MUI Date state
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

    const [showNewBooking, setShowNewBooking] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
    const [allBookings, setAllBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [bookingForm, setBookingForm] = useState({
        name: user.name || '',
        date: '',
        startTime: '',
        endTime: ''
    });

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const data = await bookingService.getBookings();
            setAllBookings(Array.isArray(data) ? data : []);
        } catch (err) {
            setAllBookings([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
        const interval = setInterval(fetchBookings, 15000);
        return () => clearInterval(interval);
    }, []);

    // Generate slots for the currently selected date
    const generateTimeSlots = (dateString: string): TimeSlot[] => {
        const bookingsOnThisDay = allBookings.filter(b => b.date === dateString);
        const timeSlots = [
            { start: '09:00', end: '10:00' }, { start: '10:00', end: '11:00' },
            { start: '11:00', end: '12:00' }, { start: '12:00', end: '13:00' },
            { start: '13:00', end: '14:00' }, { start: '14:00', end: '15:00' },
            { start: '15:00', end: '16:00' }, { start: '16:00', end: '17:00' },
            { start: '17:00', end: '18:00' },
        ];
        return timeSlots.map((slot, index) => {
            const existing = bookingsOnThisDay.find(b => b.startTime === slot.start);
            return existing
                ? { id: existing.id || `${dateString}-${index}`, startTime: slot.start, endTime: slot.end, isBooked: true, bookedBy: existing.userName }
                : { id: `${dateString}-${index}`, startTime: slot.start, endTime: slot.end, isBooked: false };
        });
    };

    const handleBookSlot = (slot: TimeSlot) => {
        if (slot.isBooked) return;
        const dateString = selectedDate.format('YYYY-MM-DD');
        setPendingBooking({
            turfId: '1', turfName: 'Elite Football Arena',
            userName: user.name, userEmail: user.email,
            date: dateString, startTime: slot.startTime, endTime: slot.endTime,
            totalPrice: 500, status: 'pending'
        });
        setShowPaymentModal(true);
    };

    const handleNewBookingSubmit = () => {
        if (!bookingForm.name || !bookingForm.date || !bookingForm.startTime || !bookingForm.endTime) {
            alert('Please fill all fields'); return;
        }
        const bookingDate = dayjs(bookingForm.date);
        const today = dayjs().startOf('day');
        if (bookingDate.isBefore(today)) { alert('Cannot book for past dates.'); return; }
        setPendingBooking({
            turfId: '1', turfName: 'Elite Football Arena',
            userName: bookingForm.name, userEmail: user.email,
            date: bookingForm.date, startTime: bookingForm.startTime, endTime: bookingForm.endTime,
            totalPrice: 500, status: 'pending'
        });
        setShowNewBooking(false);
        setShowPaymentModal(true);
    };

    const confirmAndPay = async () => {
        if (!pendingBooking) return;
        setIsLoading(true);
        try {
            const result = await bookingService.createBooking({ ...pendingBooking, status: 'confirmed', paymentMethod });
            if (result.success) {
                await fetchBookings();
                setShowPaymentModal(false);
                setPendingBooking(null);
                if (onBookingComplete) onBookingComplete();
            } else {
                alert('Booking failed: ' + (result.message || 'Unknown error'));
            }
        } catch {
            alert('Network Error: Please check if backend is running on port 5001');
        } finally {
            setIsLoading(false);
        }
    };

    const isPastDate = selectedDate.isBefore(dayjs().startOf('day'));
    const selectedDateString = selectedDate.format('YYYY-MM-DD');
    const displaySlots = generateTimeSlots(selectedDateString);

    const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm font-medium transition-all shadow-sm";

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            <div className="max-w-[1400px] mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">

                {/* ── Header ── */}
                <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 60%, #4ade80 100%)' }}>
                    <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
                    <div className="absolute top-4 right-16 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

                    <div className="relative z-10 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm">
                                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-white tracking-tight">Event Calendar</h1>
                                <p className="text-green-100 text-xs font-semibold mt-0.5">Manage your turf bookings</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowNewBooking(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-green-700 text-xs font-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0">
                                <Plus className="w-4 h-4" />
                                New Booking
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Main Layout: MUI Calendar + Slots panel ── */}
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    
                    {/* Left: MUI DateCalendar */}
                    <div className="flex-shrink-0 bg-white border border-gray-100 shadow-sm rounded-3xl p-4 self-start">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar 
                                value={selectedDate} 
                                onChange={(newValue) => newValue && setSelectedDate(newValue)}
                                sx={{
                                    '.MuiPickersDay-root.Mui-selected': {
                                        backgroundColor: '#16a34a',
                                        '&:hover': {
                                            backgroundColor: '#15803d',
                                        }
                                    },
                                    '.MuiPickersDay-today': {
                                        borderColor: '#16a34a'
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </div>

                    {/* Right: Available Slots for Selected Date */}
                    <div className="flex-1 bg-gray-50/50 rounded-3xl border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-xl font-black text-gray-800">
                                    {selectedDate.format('MMMM D, YYYY')}
                                </h2>
                                <p className="text-sm font-medium text-gray-500 mt-1">
                                    {isPastDate ? "Past Date - Booking Disabled" : "Select an available time slot below"}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {displaySlots.map(slot => (
                                <div key={slot.id}
                                    onClick={() => !slot.isBooked && !isPastDate && handleBookSlot(slot)}
                                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200
                                        ${slot.isBooked
                                            ? 'bg-orange-50 border-orange-200 cursor-not-allowed opacity-80'
                                            : isPastDate 
                                                ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                                                : 'bg-white border-green-200 hover:border-green-400 hover:shadow-md hover:shadow-green-100 cursor-pointer hover:-translate-y-0.5'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${slot.isBooked ? 'bg-orange-100' : isPastDate ? 'bg-gray-200' : 'bg-green-100'}`}>
                                            <Clock className={`w-5 h-5 ${slot.isBooked ? 'text-orange-600' : isPastDate ? 'text-gray-500' : 'text-green-600'}`} />
                                        </div>
                                        <div>
                                            <div className="text-[15px] font-black text-gray-800">{slot.startTime} – {slot.endTime}</div>
                                            {slot.isBooked && slot.bookedBy && (
                                                <div className="text-xs text-gray-500 font-medium">By {slot.bookedBy}</div>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full
                                        ${slot.isBooked 
                                            ? 'bg-orange-200 text-orange-800' 
                                            : isPastDate 
                                                ? 'bg-gray-300 text-gray-600'
                                                : 'bg-green-500 text-white shadow-sm'}`}>
                                        {slot.isBooked ? 'Booked' : isPastDate ? 'Unavailable' : 'Book'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════════════ MODAL: Payment ══════════════ */}
            {showPaymentModal && pendingBooking && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 flex items-center justify-between" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                            <div>
                                <h2 className="text-xl font-black text-white">Booking Payment</h2>
                                <p className="text-green-100 text-xs font-medium mt-0.5">Complete your reservation</p>
                            </div>
                            <button onClick={() => { setShowPaymentModal(false); setPendingBooking(null); }}
                                className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                                {[
                                    { label: 'Turf Facility', value: pendingBooking.turfName, cls: 'font-black text-green-700 underline' },
                                    { label: 'Booking Date', value: pendingBooking.date, cls: 'font-bold text-gray-900' },
                                    { label: 'Scheduled Time', value: `${pendingBooking.startTime} – ${pendingBooking.endTime}`, cls: 'font-bold text-green-600' },
                                ].map(({ label, value, cls }) => (
                                    <div key={label} className="flex justify-between text-sm mb-2.5">
                                        <span className="text-gray-500 font-medium">{label}</span>
                                        <span className={cls}>{value}</span>
                                    </div>
                                ))}
                                <div className="border-t border-gray-200 pt-3 mt-1 flex justify-between items-center">
                                    <span className="font-black text-gray-900">Total Bill</span>
                                    <span className="text-2xl font-black text-green-600">₹500.00</span>
                                </div>
                            </div>

                            <p className="text-sm font-black text-gray-700 mb-3">Select Payment Method</p>
                            <div className="space-y-3 mb-6">
                                {[
                                    { id: 'cash', icon: <Banknote className="w-5 h-5 text-green-600" />, title: 'Pay by Cash', sub: 'Pay at the turf counter', bg: 'bg-green-50' },
                                    { id: 'online', icon: <CreditCard className="w-5 h-5 text-blue-600" />, title: 'Online Transaction', sub: 'Pay instantly via UPI or Card', bg: 'bg-blue-50' },
                                ].map(({ id, icon, title, sub, bg }) => (
                                    <div key={id} onClick={() => setPaymentMethod(id as PaymentMethod)}
                                        className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all
                                            ${paymentMethod === id ? 'border-green-500 ' + bg + ' shadow-sm' : 'border-gray-100 hover:border-green-200'}`}>
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                                            {icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-gray-900">{title}</p>
                                            <p className="text-xs text-gray-500 font-medium">{sub}</p>
                                        </div>
                                        {paymentMethod === id && (
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <button onClick={confirmAndPay} disabled={isLoading}
                                className="w-full py-4 rounded-2xl font-black text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-green-600/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70"
                                style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
                                {isLoading
                                    ? <Loader2 className="w-5 h-5 animate-spin" />
                                    : <><CheckCircle2 className="w-5 h-5" /> Confirm &amp; Book for ₹500</>
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════ MODAL: New Booking ══════════════ */}
            {showNewBooking && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 flex items-center justify-between" style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                            <div>
                                <h2 className="text-xl font-black text-white">New Booking</h2>
                                <p className="text-green-100 text-xs font-medium mt-0.5">Reserve your slot now</p>
                            </div>
                            <button onClick={() => setShowNewBooking(false)}
                                className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-1.5">Name</label>
                                <input type="text" value={bookingForm.name}
                                    onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })}
                                    className={inputCls} placeholder="Enter your name" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-1.5">Date</label>
                                <input type="date" value={bookingForm.date}
                                    onChange={e => setBookingForm({ ...bookingForm, date: e.target.value })}
                                    className={inputCls} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-1.5">Start Time</label>
                                    <input type="time" value={bookingForm.startTime}
                                        onChange={e => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                                        className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-gray-600 uppercase tracking-wider mb-1.5">End Time</label>
                                    <input type="time" value={bookingForm.endTime}
                                        onChange={e => setBookingForm({ ...bookingForm, endTime: e.target.value })}
                                        className={inputCls} />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setShowNewBooking(false)}
                                    className="flex-1 py-3 border-2 border-gray-200 rounded-2xl text-sm font-black text-gray-600 hover:bg-gray-50 transition-all">
                                    Cancel
                                </button>
                                <button onClick={handleNewBookingSubmit}
                                    className="flex-1 py-3 rounded-2xl text-sm font-black text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
                                    style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
