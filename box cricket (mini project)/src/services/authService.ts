// Mock authentication service - in a real app, this would connect to a backend API
const TOKEN_KEY = 'turfflow_auth_token';
const USER_KEY = 'turfflow_user';

// Mock JWT token generator (for demo purposes only)
const generateMockToken = (user: any) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
  };

  // In a real app, this would be a proper JWT with header.payload.signature
  return btoa(JSON.stringify(payload));
};

// Mock JWT token decoder (for demo purposes only)
const decodeMockToken = (token: string) => {
  try {
    const payload = JSON.parse(atob(token));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const API_URL = 'http://localhost:5001/api';

export const authService = {
  // Check if user exists by email and return their details
  async checkUserExists(email: string) {
    try {
      const response = await fetch(`${API_URL}/check-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      return {
        exists: data.exists,
        role: data.role || 'user',
        name: data.name || 'User',
        id: data.id
      };
    } catch (error) {
      console.error('Error checking user existence:', error);
      // Fallback for demo
      return {
        exists: email.includes('turfflow') || email.includes('gmail'),
        role: email.includes('admin') ? 'admin' : (email.includes('staff') ? 'staff' : 'user'),
        name: email.split('@')[0]
      };
    }
  },

  // Send OTP to email via backend
  async sendEmailOTP(email: string, otp: string) {
    try {
      const response = await fetch(`${API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      return await response.json();
    } catch (error) {
      console.error('Error sending email OTP:', error);
      return { success: false, message: 'Could not connect to the email server. Please ensure the backend is running.' };
    }
  },

  // Register a new user
  async register(userData: { name: string; email: string; phone?: string; role?: string }) {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Notify backend of successful login to record activity
  async notifyLoginSuccess(email: string) {
    try {
      await fetch(`${API_URL}/login-success`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch (error) {
      console.error('Error recording login activity:', error);
    }
  },

  // Login with email/password
  async loginWithEmailAndPassword(email: string, password: string, userData?: any) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const user = data.user;
      const token = generateMockToken(user);
      this.setToken(token);
      this.setUser(user);

      return { user, token };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Login with phone OTP
  async loginWithPhone(phone: string, otp: string) {
    // Mock phone authentication
    if (otp !== '123456') {
      throw new Error('Invalid OTP');
    }

    // Mock user data for phone login
    const user = {
      id: '4',
      name: 'Phone User',
      email: `${phone}@turfflow.com`,
      role: 'user'
    };

    const token = generateMockToken(user);
    this.setToken(token);
    this.setUser(user);

    return { user, token };
  },

  // Social login
  async loginWithSocial(provider: string, socialData: any) {
    // Mock social login
    const user = {
      id: '5',
      name: socialData.name || 'Social User',
      email: socialData.email || `${provider}@turfflow.com`,
      role: 'user'
    };

    const token = generateMockToken(user);
    this.setToken(token);
    this.setUser(user);

    return { user, token };
  },

  // Validate user credentials (mock)
  validateUser(email: string, password: string) {
    // Enforce specific passwords for demo accounts
    if (email === 'admin@turfflow.com' && password === 'admin123') {
      return {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'admin'
      };
    } else if (email === 'staff@turfflow.com' && password === 'staff123') {
      return {
        id: '2',
        name: 'Staff Member',
        email: email,
        role: 'staff'
      };
    } else if (password === 'user123') {
      // General fallback for OTP or user login
      return {
        id: '3',
        name: 'Regular User',
        email: email,
        role: 'user'
      };
    }
    return null; // Invalid credentials
  },

  // Get current user from token
  getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;

    const decoded = decodeMockToken(token);
    if (!decoded) return null;

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      this.logout();
      return null;
    }

    return this.getUser();
  },

  // Get JWT token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Set JWT token
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Get user data
  getUser() {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  // Set user data
  setUser(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    const decoded = decodeMockToken(token);
    if (!decoded) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  },

  // Logout
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Get user role
  getUserRole() {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  },

  // Check if user has specific role
  hasRole(role: string) {
    const userRole = this.getUserRole();
    return userRole === role;
  },

  // Refresh token (mock)
  async refreshToken() {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('No user found');
    }

    const token = generateMockToken(user);
    this.setToken(token);
    this.setUser(user);

    return { user, token };
  }
};