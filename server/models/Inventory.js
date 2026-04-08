const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
    itemName: { type: String, required: true },
    quantity: { type: Number, default: 0 },
    category: { type: String, default: 'sports' },
    price: { type: Number, default: 0 },
    minStock: { type: Number, default: 5 },
    maxStock: { type: Number, default: 50 },
    storeLocation: { type: String, default: 'Main Store' },
    supplier: { type: String, default: 'General Supplier' },
    totalSold: { type: Number, default: 0 },
    condition: { type: String, enum: ['new', 'good', 'worn', 'damaged'], default: 'good' },
    lastChecked: { type: Date, default: Date.now },
    updatedBy: { type: String }
});

module.exports = mongoose.model('Inventory', InventorySchema);
