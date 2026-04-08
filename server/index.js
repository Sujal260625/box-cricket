const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import Models
const User = require('./models/User');
const Activity = require('./models/Activity');
const Inventory = require('./models/Inventory');
const Auction = require('./models/Auction');
const Booking = require('./models/Booking');
const Order = require('./models/Order');
const Match = require('./models/Match');
const Player = require('./models/Player');
const Ground = require('./models/Ground');
const app = express();
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/boxcricket')
    .then(() => console.log('✅ MongoDB Connected Successfully to Atlas/Local'))
    .catch(err => {
        console.error('❌ CRITICAL: MongoDB Connection Error!');
        console.error('Error Details:', err.message);
        console.error('Please ensure your IP is whitelisted in MongoDB Atlas Network Access.');
    });

app.use(cors());
app.use(express.json());

// Helper to log activity
const logActivity = async (userId, userName, action, details) => {
    try {
        await Activity.create({ userId, userName, action, details });
        console.log(`[ACTIVITY] ${userName} performed ${action}`);
    } catch (err) {
        console.error('Error logging activity:', err);
    }
};

app.get('/api/ping', (req, res) => res.json({ status: 'ok', port: PORT, database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));

// Email Transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Port 587 uses STARTTLS
    auth: {
        user: process.env.GMAIL_USER || 'sujal.patel38833@gmail.com',
        pass: process.env.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Helps avoid local SSL issues
    }
});

// --- AUTHENTICATION API ---

app.post('/api/check-user', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            res.json({ exists: true, role: user.role, name: user.name, id: user._id });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/register', async (req, res) => {
    const { name, email, phone, role } = req.body;
    try {
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        user = await User.create({
            name,
            email: email.toLowerCase(),
            phone,
            role: role || 'user'
        });

        await logActivity(user._id, user.name, 'USER_REGISTERED', { email: user.email, role: user.role });

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // For now, since we haven't implemented hashing yet, we'll check against 'admin123', 'staff123', 'user123'
        // based on roles, OR let any password through for testing if it's a new user.
        // In a real app, this would use bcrypt.compare(password, user.password)

        let isValid = false;
        if (user.role === 'admin' && password === 'admin123') isValid = true;
        else if (user.role === 'staff' && password === 'staff123') isValid = true;
        else if (password === 'user123') isValid = true;
        else if (user.email === 'sujal.patel38833@gmail.com') isValid = true; // Superuser bypass

        if (isValid) {
            user.lastLogin = new Date();
            await user.save();
            await logActivity(user._id, user.name, 'USER_LOGIN', { ip: req.ip });
            res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/login-success', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { lastLogin: new Date() },
            { new: true }
        );
        if (user) {
            await logActivity(user._id, user.name, 'USER_LOGIN', { ip: req.ip });
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/send-otp', async (req, res) => {
    const { email, otp } = req.body;

    const mailOptions = {
        from: `"TurfFlow Support" <${process.env.GMAIL_USER || 'sujal.patel38833@gmail.com'}>`,
        to: email,
        subject: 'Your TurfFlow Verification Code',
        html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #15803d; padding: 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">TurfFlow</h1>
        </div>
        <div style="padding: 40px 30px; color: #333333;">
          <h2 style="font-size: 24px; margin-bottom: 20px; color: #1a1a1a;">Verification Code</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Hello,<br><br>
            Thank you for choosing <strong>TurfFlow</strong>. Use the verification code below to complete your sign-in process. This code is valid for 10 minutes.
          </p>
          <div style="background-color: #f0fdf4; border: 2px dashed #15803d; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 30px;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #15803d;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #ef4444; font-weight: bold; text-align: center; margin-bottom: 30px;">
            ⚠️ DON'T SHARE THIS OTP WITH ANYONE.
          </p>
          <p style="font-size: 14px; color: #666666; line-height: 1.5; border-top: 1px solid #eeeeee; padding-top: 20px;">
            If you didn't request this code, you can safely ignore this email. Someone might have typed your email address by mistake.
          </p>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
          © 2026 TurfFlow - Intelligent Sports Management System<br>
          sujal.patel38833@gmail.com
        </div>
      </div>
    `
    };

    try {
        console.log(`Sending OTP ${otp} to ${email}`);
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('CRITICAL EMAIL ERROR:', error.message);
        res.status(500).json({
            success: false,
            message: 'Email service authentication failed. Check server console.'
        });
    }
});

// --- BOOKINGS API ---

app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = await Booking.create(req.body);
        const user = await User.findOne({ email: req.body.userEmail });

        await logActivity(user?._id, req.body.userName, 'BOOKING_CREATED', {
            bookingId: newBooking._id,
            turf: newBooking.turfName,
            date: newBooking.date
        });

        // Send Confirmation Email
        const mailOptions = {
            from: `"TurfFlow Support" <${process.env.GMAIL_USER || 'sujal.patel38833@gmail.com'}>`,
            to: newBooking.userEmail,
            subject: `Booking Confirmed: ${newBooking.turfName}`,
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                <div style="background-color: #15803d; padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">Booking Successful!</h1>
                </div>
                <div style="padding: 40px 30px; color: #333333;">
                    <h2 style="font-size: 22px; margin-bottom: 20px; color: #1a1a1a;">Hello ${newBooking.userName},</h2>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                        Great news! Your booking at <strong>${newBooking.turfName}</strong> has been successfully confirmed. We've reserved the slot for you.
                    </p>
                    
                    <div style="background-color: #f9fafb; border-radius: 8px; padding: 25px; margin-bottom: 30px; border: 1px solid #efefef;">
                        <h3 style="margin-top: 0; color: #15803d; font-size: 18px; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">Booking Details</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                            <tr>
                                <td style="padding: 8px 0; color: #666666; width: 40%;">Date:</td>
                                <td style="padding: 8px 0; font-weight: 600;">${new Date(newBooking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666666;">Time Slot:</td>
                                <td style="padding: 8px 0; font-weight: 600;">${newBooking.startTime} - ${newBooking.endTime}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666666;">Payment Method:</td>
                                <td style="padding: 8px 0; font-weight: 600; text-transform: capitalize;">${newBooking.paymentMethod || 'Cash'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #666666;">Total Amount:</td>
                                <td style="padding: 8px 0; font-weight: 800; color: #15803d; font-size: 18px;">₹${newBooking.totalPrice || 500}</td>
                            </tr>
                            ${newBooking.transactionId ? `
                            <tr>
                                <td style="padding: 8px 0; color: #666666;">Transaction ID:</td>
                                <td style="padding: 8px 0; font-family: monospace; font-size: 12px;">${newBooking.transactionId}</td>
                            </tr>` : ''}
                        </table>
                    </div>

                    <p style="font-size: 14px; color: #666666; line-height: 1.5; text-align: center;">
                        Please arrive at least 15 minutes before your scheduled time. If you need to cancel or reschedule, please do so at least 24 hours in advance.
                    </p>
                </div>
                <div style="background-color: #f0fdf4; padding: 20px; text-align: center; font-size: 12px; color: #15803d; font-weight: 500;">
                    Thank you for using TurfFlow!<br>
                    © 2026 TurfFlow - Smart Sports Booking
                </div>
            </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`Booking confirmation email sent to ${newBooking.userEmail}`);
        } catch (mailError) {
            console.error('Failed to send booking email:', mailError.message);
            // We don't fail the booking if email fails, but we log it
        }

        res.json({ success: true, booking: newBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/bookings/:id/payment', async (req, res) => {
    const { status } = req.body;
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { paymentStatus: status || 'paid' },
            { new: true }
        );
        if (booking) {
            await logActivity(null, 'ADMIN/STAFF', `PAYMENT_${(status || 'paid').toUpperCase()}`, {
                bookingId: booking._id,
                amount: booking.totalPrice,
                turf: booking.turfName,
                status: booking.paymentStatus
            });
            res.json({ success: true, booking });
        } else {
            res.status(404).json({ success: false, message: 'Booking not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- INVENTORY API ---

app.get('/api/inventory', async (req, res) => {
    try {
        const items = await Inventory.find().sort({ itemName: 1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/inventory', async (req, res) => {
    try {
        const item = await Inventory.create(req.body);
        await logActivity(null, 'SYSTEM', 'INVENTORY_ADDED', { item: item.itemName, qty: item.quantity });
        res.json({ success: true, item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/inventory/:id', async (req, res) => {
    try {
        const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        await logActivity(null, 'ADMIN/STAFF', 'INVENTORY_UPDATED', { item: item.itemName, newQty: item.quantity });
        res.json({ success: true, item });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/inventory/:id', async (req, res) => {
    try {
        const item = await Inventory.findByIdAndDelete(req.params.id);
        await logActivity(null, 'ADMIN', 'INVENTORY_DELETED', { item: item?.itemName });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- AUCTIONS API ---

app.get('/api/auctions', async (req, res) => {
    try {
        const auctions = await Auction.find().sort({ startTime: 1 });
        res.json(auctions);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/auctions', async (req, res) => {
    try {
        const auction = await Auction.create(req.body);
        await logActivity(req.body.createdBy || null, req.body.creatorName || 'ADMIN', 'AUCTION_CREATED', { title: auction.title });
        res.json({ success: true, auction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/auctions/:id', async (req, res) => {
    try {
        await Auction.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Auction deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/auctions/:id/bid', async (req, res) => {
    const { itemId, amount, userName, userId } = req.body;
    try {
        const auction = await Auction.findById(req.params.id);
        const item = auction.items.id(itemId);

        if (amount <= item.currentBid) {
            return res.status(400).json({ success: false, message: 'Bid must be higher than current bid' });
        }

        item.currentBid = amount;
        item.highestBidder = userName;

        if (!auction.participants.includes(userId)) {
            auction.participants.push(userId);
        }

        await auction.save();
        await logActivity(userId, userName, 'PLACED_BID', { auctionId: auction._id, amount });

        res.json({ success: true, auction });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- ORDERS API ---

app.post('/api/orders', async (req, res) => {
    try {
        const order = await Order.create(req.body);
        await logActivity(req.body.userId, req.body.userName, 'PLACED_ORDER', { orderId: order._id, total: order.total });
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const { userId } = req.query;
        const filter = userId ? { userId } : {};
        const orders = await Order.find(filter).sort({ orderDate: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/orders/:id/status', async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        await logActivity(req.body.staffId, 'STAFF', 'ORDER_STATUS_UPDATED', { orderId: order._id, status: order.status });
        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- ACTIVITY LOGS ---

app.get('/api/activities', async (req, res) => {
    try {
        const logs = await Activity.find().sort({ timestamp: -1 }).limit(100);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- MATCHES API ---

app.get('/api/matches', async (req, res) => {
    try {
        const matches = await Match.find().sort({ createdAt: -1 });
        res.json(matches);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/matches', async (req, res) => {
    try {
        const match = await Match.create(req.body);
        res.json({ success: true, match });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/matches/:id', async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, match });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/matches/:id', async (req, res) => {
    try {
        await Match.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- PLAYERS API ---

app.get('/api/players', async (req, res) => {
    try {
        const players = await Player.find().sort({ name: 1 });
        res.json(players);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/players', async (req, res) => {
    try {
        const player = await Player.create(req.body);
        res.json({ success: true, player });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/players/:id', async (req, res) => {
    try {
        await Player.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- GROUNDS API ---

app.get('/api/grounds', async (req, res) => {
    try {
        const grounds = await Ground.find().sort({ createdAt: 1 });
        res.json(grounds);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/grounds', async (req, res) => {
    try {
        const ground = await Ground.create(req.body);
        res.json({ success: true, ground });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/grounds/:id', async (req, res) => {
    try {
        await Ground.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
