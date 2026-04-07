const mongoose = require('mongoose');

const GroundSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, enum: ['active', 'maintenance', 'occupied'], default: 'active' },
    color: { type: String, default: 'bg-green-500' }
}, { timestamps: true });

module.exports = mongoose.model('Ground', GroundSchema);
