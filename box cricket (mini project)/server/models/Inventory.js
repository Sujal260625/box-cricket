const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    category: { type: String },
    condition: { type: String, enum: ['new', 'good', 'worn', 'damaged'], default: 'good' },
    lastChecked: { type: Date, default: Date.now },
    updatedBy: { type: String }
});

module.exports = mongoose.model('Inventory', InventorySchema);
