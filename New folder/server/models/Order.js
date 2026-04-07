const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    items: [
        {
            itemId: { type: String },
            name: { type: String },
            price: { type: Number },
            quantity: { type: Number }
        }
    ],
    subtotal: { type: Number },
    tax: { type: Number },
    total: { type: Number },
    deliveryAddress: { type: String },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered'], default: 'confirmed' }
});

module.exports = mongoose.model('Order', OrderSchema);
