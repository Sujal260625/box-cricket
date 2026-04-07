const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    turfId: String,
    turfName: String,
    team1: { type: String, required: true },
    team2: { type: String, required: true },
    score1: { type: Number, default: 0 },
    score2: { type: Number, default: 0 },
    status: { type: String, enum: ['live', 'finished', 'upcoming'], default: 'live' },
    sport: String,
    startTime: String
}, { timestamps: true });

module.exports = mongoose.model('Match', MatchSchema);
