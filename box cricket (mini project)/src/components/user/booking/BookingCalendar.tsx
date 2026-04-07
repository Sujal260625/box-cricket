import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { mockTurfs, mockBookings, Turf, Booking } from '../../../data/mockData';
import { PaymentModal } from './PaymentModal';

interface BookingCalendarProps {
  turf: Turf;
  onBookingComplete: (booking: Booking) => void;
  currentUser: any;
}

interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
}

interface DaySlots {
  date: string;
  slots: TimeSlot[];
}

export function BookingCalendar({ turf, onBookingComplete, currentUser }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingDuration, setBookingDuration] = useState<number>(1);
  const [bookingStep, setBookingStep] = useState<'calendar' | 'time' | 'confirm' | 'payment'>('calendar');
  const [bookingNote, setBookingNote] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);

  // Generate available time slots for a given date
  const generateTimeSlots = (date: string): DaySlots => {
    const slots: TimeSlot[] = [];

    // Define available time slots (9 AM to 10 PM)
    for (let hour = 9; hour <= 22; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      const timeSlot = `${time} - ${endTime}`;

      // Check if this time slot is already booked
      const isBooked = mockBookings.some(booking =>
        booking.date === date &&
        booking.timeSlot === timeSlot &&
        booking.turfId === turf.id
      );

      slots.push({
        time: timeSlot,
        available: !isBooked,
        price: turf.pricePerHour
      });
    }

    return { date, slots };
  };

  // Get days for the current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: string[] = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      days.push(dateStr);
    }

    return days;
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setBookingStep('time');
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    return turf.pricePerHour * bookingDuration;
  };

  // Handle booking confirmation
  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime || !currentUser) return;

    // Parse the selected time to get start and end hours
    const [startTime] = selectedTime.split(' - ');
    const [hours, minutes] = startTime.split(':').map(Number);

    // Calculate end time based on duration
    const endTimeHours = hours + bookingDuration;
    const endTime = `${endTimeHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const timeSlot = `${startTime} - ${endTime}`;

    const newBooking: Booking = {
      id: (mockBookings.length + 1).toString(),
      turfId: turf.id,
      turfName: turf.name,
      userId: currentUser.id,
      userName: currentUser.name,
      date: selectedDate,
      timeSlot: timeSlot,
      duration: bookingDuration,
      totalPrice: calculateTotalPrice(),
      status: 'pending',
      paymentStatus: 'pending'
    };

    setCurrentBooking(newBooking);
    setBookingStep('payment');
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (result: any) => {
    // Update booking with payment details
    const updatedBooking = {
      ...currentBooking,
      status: 'confirmed',
      paymentStatus: 'paid',
      transactionId: result.transactionId
    };

    onBookingComplete(updatedBooking);
    setShowPaymentModal(false);
    setBookingStep('confirm');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Optionally show error to user
  };

  // Get available slots for selected date
  const availableSlots = selectedDate ? generateTimeSlots(selectedDate) : null;

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Book {turf.name}</h2>

        {bookingStep === 'calendar' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentDate).map((date, index) => {
                const dateObj = new Date(date);
                const isPast = dateObj < new Date();
                const isToday = date === new Date().toISOString().split('T')[0];

                // Check if this date has any bookings for this turf
                const hasBookings = mockBookings.some(booking =>
                  booking.date === date && booking.turfId === turf.id
                );

                return (
                  <button
                    key={date}
                    onClick={() => !isPast && handleDateSelect(date)}
                    disabled={isPast}
                    className={`
                      h-12 rounded-lg flex items-center justify-center
                      ${isPast ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-green-100'}
                      ${isToday ? 'bg-green-600 text-white' : ''}
                      ${hasBookings && !isPast && !isToday ? 'bg-red-100 text-red-700' : ''}
                      ${selectedDate === date ? 'bg-green-600 text-white' : ''}
                    `}
                  >
                    {dateObj.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {bookingStep === 'time' && selectedDate && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
              <button
                onClick={() => setBookingStep('calendar')}
                className="text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Calendar
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-3">Select Time Slot</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                {availableSlots?.slots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`
                      p-2 sm:p-3 rounded-lg border
                      ${slot.available
                        ? selectedTime === slot.time
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                        : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                      }
                    `}
                  >
                    <div className="font-medium text-sm sm:text-base">{slot.time}</div>
                    <div className="text-xs sm:text-sm text-gray-600">₹{slot.price}/hr</div>
                    {!slot.available && <div className="text-xs text-red-600 mt-1">Booked</div>}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-3">Booking Duration</h4>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map(duration => (
                  <button
                    key={duration}
                    onClick={() => setBookingDuration(duration)}
                    className={`
                      px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border text-sm
                      ${bookingDuration === duration
                        ? 'border-green-600 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:bg-gray-50'
                      }
                    `}
                  >
                    {duration} hour{duration > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-2">Special Requests</label>
              <textarea
                value={bookingNote}
                onChange={(e) => setBookingNote(e.target.value)}
                placeholder="Any special requests or notes for the facility?"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span>Subtotal ({bookingDuration} hours @ ₹{turf.pricePerHour}/hr)</span>
                <span>₹{calculateTotalPrice()}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span className="text-green-600">₹{calculateTotalPrice()}</span>
              </div>
            </div>

            <button
              onClick={handleConfirmBooking}
              disabled={!selectedTime}
              className="w-full bg-green-600 text-white py-2.5 sm:py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              Confirm Booking
            </button>
          </div>
        )}

        {bookingStep === 'confirm' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
            <p className="text-gray-600 mb-6">
              Your booking for {turf.name} on {selectedDate} at {selectedTime} has been confirmed.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg text-left max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span className="font-medium">{turf.location}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CalendarIcon className="w-5 h-5 text-gray-600" />
                <span>{new Date(selectedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span>{selectedTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-gray-600" />
                <span className="font-bold">₹{calculateTotalPrice()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPaymentModal && currentBooking && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          bookingDetails={currentBooking}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </>
  );
}