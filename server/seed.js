const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const User = require('./models/User');
const Inventory = require('./models/Inventory');
const Auction = require('./models/Auction');
const Booking = require('./models/Booking');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/boxcricket';

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Seed Users (Smart check)
        const defaultUsers = [
            { name: 'Admin User', email: 'admin@turfflow.com', role: 'admin' },
            { name: 'Staff Member', email: 'staff@turfflow.com', role: 'staff' },
            { name: 'Regular User', email: 'user@turfflow.com', role: 'user' },
            { name: 'Sujal Patel', email: 'sujal.patel38833@gmail.com', role: 'admin' }
        ];

        for (const u of defaultUsers) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create(u);
                console.log(`User ${u.email} created.`);
            }
        }
        console.log('Users sync completed.');

        // Seed Inventory (Smart check)
        const defaultInv = [
            { itemName: 'Cricket Bats (Willow)', quantity: 15, category: 'Sports', condition: 'good' },
            { itemName: 'Tennis Balls (Pack of 6)', quantity: 40, category: 'Sports', condition: 'new' },
            { itemName: 'Stumps (Set)', quantity: 10, category: 'Sports', condition: 'good' },
            { itemName: 'Gloves (Pair)', quantity: 20, category: 'Sports', condition: 'good' },
            { itemName: 'Energy Drinks (Box)', quantity: 100, category: 'Food', condition: 'new' }
        ];
        for (const item of defaultInv) {
            const exists = await Inventory.findOne({ itemName: item.itemName });
            if (!exists) await Inventory.create(item);
        }
        console.log('Inventory sync completed.');

        // Seed Auctions (Smart check)
        const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 7);

        const defaultAuctions = [
            {
                title: 'Premium Cricket Kit Auction',
                description: 'Complete professional kit from SG',
                startTime: new Date(),
                endTime: tomorrow,
                status: 'active',
                items: [
                    { name: 'SG Players Edition Bat', startingBid: 5000, currentBid: 5500, highestBidder: 'Regular User' },
                    { name: 'Full Protective Set', startingBid: 2000, currentBid: 2100, highestBidder: 'Staff Member' }
                ]
            },
            {
                title: 'Weekend Night Slot Auction',
                description: 'Prime 9PM-11PM Saturday slot',
                startTime: new Date(),
                endTime: nextWeek,
                status: 'active',
                items: [
                    { name: 'Saturday Night Slot (Elite Arena)', startingBid: 1000, currentBid: 1200, highestBidder: 'Sujal Patel' }
                ]
            }
        ];
        for (const auc of defaultAuctions) {
            const exists = await Auction.findOne({ title: auc.title });
            if (!exists) await Auction.create(auc);
        }
        console.log('Auctions sync completed.');

        console.log('Database synchronization completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
};

seedData();
