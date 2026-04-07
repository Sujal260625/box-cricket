const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    turfId: { type: String, required: true },
    turfName: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    startTime: { type: String, required: true }, // Format: HH:mm
    endTime: { type: String, required: true }, // Format: HH:mm
    totalPrice: { type: Number },
    paymentStatus: { type: String, default: 'pending' },
    paymentMethod: { type: String, default: 'cash' },
    status: { type: String, enum: ['confirmed', 'cancelled', 'completed', 'pending'], default: 'confirmed' },
    transactionId: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
