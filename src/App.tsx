import { useState, useEffect } from 'react';
import { HomePage } from './components/shared/HomePage';
import { TurfListings } from './components/user/turf/TurfListings';
import { TurfDetails } from './components/user/turf/TurfDetails';
import { LiveScores } from './components/shared/LiveScores';
import { Tournaments } from './components/user/tournaments/Tournaments';
import { Reviews } from './components/user/reviews/Reviews';
import { LoginPage } from './components/shared/LoginPage';
import { SignupPage } from './components/shared/SignupPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { UserDashboard } from './components/user/UserDashboard';
import { authService } from './services/authService';

export type UserRole = 'admin' | 'staff' | 'user' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTurfId, setSelectedTurfId] = useState<string | null>(null);

  // Initialize authentication from token
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // Redirect to appropriate dashboard based on role
      const dashboardPage = `${user.role}-dashboard`;
      setCurrentPage(dashboardPage);
    }
  }, []);

  // Login function using auth service
  const handleLogin = async (email: string, password: string, userData?: any) => {
    try {
      const { user } = await authService.loginWithEmailAndPassword(email, password, userData);
      await authService.notifyLoginSuccess(email); // Record activity in MongoDB
      setCurrentUser(user as User);
      // Redirect to appropriate dashboard based on role
      const dashboardPage = `${user.role}-dashboard`;
      setCurrentPage(dashboardPage);
    } catch (error: any) {
      console.error('Login failed:', error);
      throw new Error(error.message || 'Invalid email or password');
    }
  };

  // Phone login function
  const handlePhoneLogin = async (phone: string, otp: string) => {
    try {
      const { user, token } = await authService.loginWithPhone(phone, otp);
      setCurrentUser(user as User);
      // Redirect to appropriate dashboard based on role
      const dashboardPage = `${user.role}-dashboard`;
      setCurrentPage(dashboardPage);
    } catch (error: any) {
      console.error('Phone login failed:', error);
      throw new Error(error.message || 'Invalid phone number or OTP');
    }
  };

  // Social login function
  const handleSocialLogin = async (provider: string, socialData: any) => {
    try {
      const { user, token } = await authService.loginWithSocial(provider, socialData);
      setCurrentUser(user as User);
      // Redirect to appropriate dashboard based on role
      const dashboardPage = `${user.role}-dashboard`;
      setCurrentPage(dashboardPage);
    } catch (error) {
      console.error('Social login failed:', error);
      // In a real app, you'd show an error message to the user
    }
  };

  // Signup function
  const handleSignup = async (userData: any) => {
    try {
      // Register user in MongoDB
      await authService.register({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: 'user'
      });

      // Automatically log in after signup
      const { user } = await authService.loginWithEmailAndPassword(userData.email, userData.password, {
        name: userData.name,
        email: userData.email,
        role: 'user'
      });

      await authService.notifyLoginSuccess(userData.email); // Record activity
      setCurrentUser(user as User);
      const dashboardPage = `${user.role}-dashboard`;
      setCurrentPage(dashboardPage);
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const navigateTo = (page: string, turfId?: string) => {
    setCurrentPage(page);
    if (turfId) {
      setSelectedTurfId(turfId);
    }
  };

  // Render appropriate component based on current page and user role
  const renderPage = () => {
    // Public pages (accessible without login)
    switch (currentPage) {
      case 'home':
        return <HomePage navigateTo={navigateTo} currentUser={currentUser} onLogout={handleLogout} />;
      case 'turfs':
        return <TurfListings navigateTo={navigateTo} currentUser={currentUser} onLogout={handleLogout} />;
      case 'turf-details':
        return <TurfDetails turfId={selectedTurfId} navigateTo={navigateTo} currentUser={currentUser} onLogout={handleLogout} />;
      case 'live-scores':
        return <LiveScores navigateTo={navigateTo} currentUser={currentUser} onLogout={handleLogout} />;
      case 'tournaments':
        return <Tournaments navigateTo={navigateTo} currentUser={currentUser} onLogout={handleLogout} />;
      case 'reviews':
        return <Reviews navigateTo={navigateTo} currentUser={currentUser} onLogout={handleLogout} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onPhoneLogin={handlePhoneLogin} onSocialLogin={handleSocialLogin} navigateTo={navigateTo} />;
      case 'signup':
        return <SignupPage navigateTo={navigateTo} onSignup={handleSignup} />;

      // Private dashboards (require authentication)
      case 'admin-dashboard':
        if (currentUser?.role === 'admin') {
          return <AdminDashboard user={currentUser} onLogout={handleLogout} navigateTo={navigateTo} />;
        }
        return <LoginPage onLogin={handleLogin} onPhoneLogin={handlePhoneLogin} onSocialLogin={handleSocialLogin} navigateTo={navigateTo} />;

      case 'staff-dashboard':
        if (currentUser?.role === 'staff') {
          return <StaffDashboard user={currentUser} onLogout={handleLogout} navigateTo={navigateTo} />;
        }
        return <LoginPage onLogin={handleLogin} onPhoneLogin={handlePhoneLogin} onSocialLogin={handleSocialLogin} navigateTo={navigateTo} />;

      case 'user-dashboard':
        if (currentUser?.role === 'user') {
          return <UserDashboard user={currentUser} onLogout={handleLogout} navigateTo={navigateTo} />;
        }
        return <LoginPage onLogin={handleLogin} onPhoneLogin={handlePhoneLogin} onSocialLogin={handleSocialLogin} navigateTo={navigateTo} />;

      default:
        return <HomePage navigateTo={navigateTo} currentUser={currentUser} onLogout={handleLogout} />;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col">
      <div className="flex-1">
        {renderPage()}
      </div>
    </div>
  );
}