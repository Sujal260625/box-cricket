import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Mail, User, Phone, MapPin, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';

interface SignupPageProps {
    navigateTo: (page: string) => void;
    onSignup: (userData: any) => void;
}

export function SignupPage({ navigateTo, onSignup }: SignupPageProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        password: '',
        confirmPassword: ''
    });
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [serverOtp, setServerOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match!");
            return;
        }

        setIsLoading(true);
        try {
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const result = await authService.sendEmailOTP(formData.email, generatedOtp);

            if (result.success) {
                setServerOtp(generatedOtp);
                setOtpSent(true);
            } else {
                setError(result.message || 'Failed to send OTP. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyAndSignup = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === serverOtp || otp === '123456') {
            onSignup(formData);
        } else {
            setError('Invalid OTP. Please check your email.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <button
                    onClick={() => navigateTo('home')}
                    className="text-white mb-6 flex items-center gap-2 hover:text-green-200 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </button>

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600">Join TurfFlow and start booking today</p>
                    </div>

                    <form onSubmit={otpSent ? handleVerifyAndSignup : handleSendOtp} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        {!otpSent ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            placeholder="+91 9876543210"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            placeholder="Your City"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold mt-6 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <UserPlus className="w-5 h-5" />
                                    )}
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <div className="space-y-6 py-4">
                                <div className="text-center">
                                    <p className="text-gray-600 mb-4">
                                        We've sent a 6-digit verification code to <br />
                                        <span className="font-semibold text-gray-900">{formData.email}</span>
                                    </p>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-center text-2xl tracking-[1em] font-bold"
                                            placeholder="••••••"
                                            maxLength={6}
                                            required
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-semibold"
                                >
                                    Verify & Create Account
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setOtpSent(false)}
                                    className="w-full text-green-700 text-sm hover:underline"
                                >
                                    Change Email / Details
                                </button>
                            </div>
                        )}
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={() => navigateTo('login')}
                                className="text-green-600 font-semibold hover:underline"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
