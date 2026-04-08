const API_URL = import.meta.env.VITE_API_URL || 'https://box-cricket-qt23.onrender.com/api';

export interface Booking {
    id?: string;
    _id?: string;
    turfId: string;
    turfName: string;
    userName: string;
    userEmail: string;
    date: string;
    startTime: string;
    endTime: string;
    totalPrice?: number;
    status?: string;
    paymentMethod?: string;
    paymentStatus?: string;
}

export const bookingService = {
    async getBookings() {
        try {
            const response = await fetch(`${API_URL}/bookings`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return [];
        }
    },

    async createBooking(bookingData: Booking) {
        try {
            const response = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating booking:', error);
            return { success: false, message: 'Failed to create booking' };
        }
    }
};

