const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: String,
    aadharCard: String,
    startingTime: String,
    endingTime: String,
    email: String,
    membershipStatus: { type: String, default: 'active' },
    lastMatch: Date,
    totalMatches: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Player', PlayerSchema);
