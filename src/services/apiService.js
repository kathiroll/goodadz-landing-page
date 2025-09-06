const API_BASE_URL = 'https://goodads.onrender.com';


// Environment variables - hardcoded for now to avoid process issues
// In production, these would be injected at build time
const ENV = {
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: 'goodads2024',
  ADMIN_SECRET_KEY: 'peepee123-goodadz-admin-secret-2024',
  JWT_SECRET: 'peepee123-goodadz-jwt-secret-2024',
  API_KEY: 'ak_04bd1da90570cdff9fd3787231cd231e'
};

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: ENV.ADMIN_USERNAME,
  password: ENV.ADMIN_PASSWORD
};

// Admin secret keys
const ADMIN_SECRET_KEY = ENV.ADMIN_SECRET_KEY;
const JWT_SECRET = ENV.JWT_SECRET;

// Debug logging for environment variables
console.log('🔍 ENVIRONMENT VARIABLES DEBUG:');
console.log('- ADMIN_USERNAME:', ENV.ADMIN_USERNAME);
console.log('- ADMIN_PASSWORD:', ENV.ADMIN_PASSWORD ? '***SET***' : 'NOT SET');
console.log('- ADMIN_SECRET_KEY:', ENV.ADMIN_SECRET_KEY ? '***SET***' : 'NOT SET');
console.log('- JWT_SECRET:', ENV.JWT_SECRET ? '***SET***' : 'NOT SET');
console.log('- process available:', typeof process !== 'undefined');
console.log('- window.__ENV__ available:', typeof window !== 'undefined' && !!window.__ENV__);

class ApiService {
  constructor() {
    this.isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  }

  // Authentication
  async login(username, password) {
    console.log('🔐 LOGIN ATTEMPT:', { username, passwordProvided: !!password });
    console.log('🔑 Expected credentials:', { 
      expectedUsername: ADMIN_CREDENTIALS.username,
      expectedPasswordProvided: !!ADMIN_CREDENTIALS.password 
    });
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      localStorage.setItem('adminLoggedIn', 'true');
      this.isLoggedIn = true;
      console.log('✅ LOGIN SUCCESS');
      return { success: true };
    }
    
    console.error('❌ LOGIN FAILED: Invalid credentials');
    throw new Error('Invalid credentials');
  }

  logout() {
    console.log('👋 LOGOUT');
    localStorage.removeItem('adminLoggedIn');
    this.isLoggedIn = false;
  }

  isAuthenticated() {
    return this.isLoggedIn;
  }

  // API calls with auth headers
  async makeRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    headers['X-API-Key'] = ENV.API_KEY;

    // Add admin secret keys for admin endpoints
    const isAdminEndpoint = endpoint.includes('/api/admin/');
    if (isAdminEndpoint && this.isLoggedIn) { 
        if (ADMIN_SECRET_KEY) {
            headers['X-Admin-Key'] = ADMIN_SECRET_KEY;
        }
        // if (JWT_SECRET) {
        //     const token = jwt.sign({ userId: "testuserid", role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        //     headers['authorization'] = `Bearer ${token}`;
        // }
    }

    // Log request details
    console.log(`🚀 API REQUEST: ${options.method || 'GET'} ${url}`);
    console.log('📋 Request Headers:', {
      ...headers,
      'X-Admin-Secret': headers['X-Admin-Secret'] ? '***HIDDEN***' : undefined,
      'X-JWT-Secret': headers['X-JWT-Secret'] ? '***HIDDEN***' : undefined
    });
    console.log('🔐 Auth Status:', {
      isAdminEndpoint,
      isLoggedIn: this.isLoggedIn,
      hasAdminSecret: !!ADMIN_SECRET_KEY,
      hasJWTSecret: !!JWT_SECRET
    });

    const startTime = Date.now();

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const duration = Date.now() - startTime;

      if (!response.ok) {
        // Log failed response details
        let errorBody = '';
        try {
          errorBody = await response.text();
        } catch (e) {
          errorBody = 'Could not read response body';
        }

        console.error(`❌ API FAILED: ${response.status} ${response.statusText} (${duration}ms)`);
        console.error('📄 Response Headers:', Object.fromEntries(response.headers.entries()));
        console.error('📝 Error Body:', errorBody);

        if (response.status === 401) {
          console.error('🔒 AUTHENTICATION ISSUE:');
          console.error('- Check if REACT_APP_ADMIN_SECRET_KEY is set:', !!ADMIN_SECRET_KEY);
          console.error('- Check if REACT_APP_JWT_SECRET is set:', !!JWT_SECRET);
          console.error('- Admin logged in status:', this.isLoggedIn);
          throw new Error('Unauthorized access. Please check your admin credentials and secret keys.');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorBody}`);
      }

      const data = await response.json();
      console.log(`✅ API SUCCESS: ${response.status} (${duration}ms)`);
      console.log('📊 Response Data:', data);

      return data;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`💥 API ERROR: ${endpoint} (${duration}ms)`, error);
      
      // Log environment variable status for debugging
      if (isAdminEndpoint) {
        console.error('🔍 DEBUG INFO:');
        console.error('- ADMIN_SECRET_KEY exists:', !!ADMIN_SECRET_KEY);
        console.error('- JWT_SECRET exists:', !!JWT_SECRET);
        console.error('- Is logged in:', this.isLoggedIn);
        console.error('- Environment check:', {
          ADMIN_SECRET_KEY_SET: !!ENV.ADMIN_SECRET_KEY,
          JWT_SECRET_SET: !!ENV.JWT_SECRET
        });
      }
      
      throw error;
    }
  }

  // Public API endpoints
  async getAds() {
    console.log('📋 Getting all ads...');
    return this.makeRequest('/api/ads');
  }

  // Admin API endpoints
  async getOverview() {
    console.log('📊 Getting admin overview...');
    return this.makeRequest('/api/admin/overview');
  }

  async getFormSubmissions(adId, page = 1, limit = 50) {
    console.log(`📝 Getting form submissions for ad ${adId} (page: ${page}, limit: ${limit})...`);
    return this.makeRequest(`/api/admin/forms/${adId}?page=${page}&limit=${limit}`);
  }

  async getAdAnalytics(adId) {
    console.log(`📈 Getting analytics for ad ${adId}...`);
    return this.makeRequest(`/api/admin/analytics/${adId}`);
  }
}

export default new ApiService();