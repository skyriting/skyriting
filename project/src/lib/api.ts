// API utility for backend communication
// In production, API_URL should be same origin (relative path) or set via VITE_API_URL
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('skyriting_auth_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token && !options.headers?.Authorization) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Cities API
export async function getCities() {
  return apiRequest<any[]>('/airports');
}

// Aircraft API
export async function getAircraft() {
  return apiRequest<any[]>('/aircrafts');
}

export async function getAircraftById(id: string) {
  return apiRequest<any>(`/aircrafts/${id}`);
}

// Popular Routes API
export async function getPopularRoutes() {
  // This will need to be implemented in backend
  // For now, return empty array
  return [];
}

export async function getRouteDistance(departureCityId: string, arrivalCityId: string) {
  // This will need to be implemented in backend
  // For now, return null
  return null;
}

// Enquiries API
export async function createEnquiry(enquiryData: any) {
  return apiRequest<any>('/inquiries', {
    method: 'POST',
    body: JSON.stringify(enquiryData),
  });
}

export async function getEnquiriesByEmail(email: string) {
  return apiRequest<any[]>(`/inquiries?email=${encodeURIComponent(email)}`);
}

// Empty Legs API
export async function getEmptyLegs() {
  // This will need to be implemented in backend
  // For now, return empty array
  return [];
}

// Memberships API
export async function getMemberships() {
  // This will need to be implemented in backend
  // For now, return empty array
  return [];
}

// Specialized Packages API
export async function getSpecializedPackage(packageType: string) {
  // This will need to be implemented in backend
  // For now, return null
  return null;
}

// Search API
export interface SearchRequest {
  tripType: 'one-way' | 'round-trip' | 'multi-trip';
  legs: Array<{
    origin: string;
    destination: string;
    departureDate: string;
    departureTime: string;
    paxCount?: number;
  }>;
  filters?: {
    aircraftClass?: string;
    minCapacity?: number;
    amenities?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price' | 'capacity' | 'speed';
  };
}

export interface SearchResult {
  aircraft: any;
  pricing: {
    baseFlyingCost: number;
    fuelSurcharge: number;
    airportFees: number;
    crewExpenses: number;
    subtotal: number;
    marginAmount: number;
    marginPercentage: number;
    taxAmount: number;
    taxRate: number;
    totalCost: number;
    currency: string;
  };
  legBreakdown: Array<{
    origin: string;
    destination: string;
    distance: number;
    flightHours: number;
    baseFlyingCost: number;
    fuelSurcharge: number;
    airportFee: number;
    crewExpense: number;
    legSubtotal: number;
  }>;
  currency: string;
}

export async function searchFlights(searchData: SearchRequest) {
  return apiRequest<{ results: SearchResult[]; count: number }>('/search', {
    method: 'POST',
    body: JSON.stringify(searchData),
  });
}

// Auth API
export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export async function login(credentials: LoginData) {
  return apiRequest<{ token: string; user: any }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function register(userData: RegisterData) {
  return apiRequest<{ token: string; user: any; message?: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// Forgot Password
export async function forgotPassword(email: string) {
  return apiRequest<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// Reset Password
export async function resetPassword(token: string, password: string) {
  return apiRequest<{ message: string }>(`/auth/reset-password/${token}`, {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

// Verify Email
export async function verifyEmail(token: string) {
  return apiRequest<{ message: string }>(`/auth/verify-email/${token}`);
}

// Resend Verification Email
export async function resendVerification(email: string) {
  return apiRequest<{ message: string; remainingSeconds?: number }>('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// Get current authenticated user
export async function getCurrentUser(token: string) {
  return apiRequest<{ user: any }>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Quotes API
export async function getQuote(id: string) {
  return apiRequest<any>(`/quotes/${id}`);
}

// Removed duplicate getUserQuotes - use the one below without parameters

export async function acceptQuote(id: string, token: string) {
  return apiRequest<any>(`/quotes/${id}/accept`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Bookings API
export interface CreateBookingData {
  quoteId: string;
  specialRequests?: string;
  contactInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

export async function createBooking(bookingData: CreateBookingData, token: string) {
  return apiRequest<any>('/bookings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookingData),
  });
}

// Removed duplicate getUserBookings - use the one below without token parameter

export async function getBooking(id: string, token: string) {
  return apiRequest<{ booking: any }>(`/bookings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function requestReschedule(
  bookingId: string,
  data: { newDate: string; newTime?: string; reason: string },
  token: string
) {
  return apiRequest<any>(`/bookings/${bookingId}/reschedule`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

// Contact & Career API
export async function createContactInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return apiRequest<any>('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createCareerApplication(data: {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  resume?: string;
  coverLetter?: string;
}) {
  return apiRequest<any>('/career', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createServiceInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceName: string;
  serviceSlug?: string;
  subject: string;
  message: string;
}) {
  return apiRequest<any>('/service-inquiry', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Services API
export async function getServices() {
  return apiRequest<{ services: any[] }>('/services');
}

export async function getServiceBySlug(slug: string) {
  return apiRequest<{ service: any }>(`/services/${slug}`);
}

// Packages API
export async function getPackages() {
  return apiRequest<{ packages: any[] }>('/packages');
}

export async function getPackageBySlug(slug: string) {
  return apiRequest<{ package: any }>(`/packages/${slug}`);
}

export async function createPackageInquiry(data: {
  name: string;
  email: string;
  phone: string;
  packageName: string;
  packageSlug: string;
  selectedPackage?: string;
  selectedPackageType?: string;
  selectedDate?: string;
  message?: string;
}) {
  return apiRequest<any>('/package-inquiry', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Articles API
export async function getArticles(params?: { category?: string; featured?: boolean; limit?: number; page?: number }) {
  const queryParams = new URLSearchParams();
  if (params?.category) queryParams.append('category', params.category);
  if (params?.featured) queryParams.append('featured', 'true');
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.page) queryParams.append('page', params.page.toString());
  
  const query = queryParams.toString();
  return apiRequest<{ articles: any[]; total: number; page: number; limit: number; totalPages: number }>(`/articles${query ? `?${query}` : ''}`);
}

export async function getArticleBySlug(slug: string) {
  return apiRequest<{ article: any }>(`/articles/${slug}`);
}

// Mobility Thread API
export async function getMobilityThreadPosts(params?: { limit?: number; page?: number }) {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.page) queryParams.append('page', params.page.toString());
  
  const query = queryParams.toString();
  return apiRequest<{ posts: any[]; total: number; page: number; limit: number; totalPages: number }>(`/mobility-thread${query ? `?${query}` : ''}`);
}

export async function getMobilityThreadPost(id: string) {
  return apiRequest<{ post: any }>(`/mobility-thread/${id}`);
}

export async function createMobilityThreadPost(data: {
  content: string;
  images?: string[];
}) {
  return apiRequest<any>('/mobility-thread', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function likeMobilityThreadPost(id: string) {
  return apiRequest<any>(`/mobility-thread/${id}/like`, {
    method: 'POST',
  });
}

export async function commentOnMobilityThreadPost(id: string, content: string) {
  return apiRequest<any>(`/mobility-thread/${id}/comment`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function deleteMobilityThreadPost(id: string) {
  return apiRequest<any>(`/mobility-thread/${id}`, {
    method: 'DELETE',
  });
}

// User Profile API
export async function getUserProfile() {
  return apiRequest<{ user: any }>('/user/profile');
}

export async function updateUserProfile(data: {
  name?: string;
  phone?: string;
  profilePhoto?: string;
}) {
  return apiRequest<{ user: any }>('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getUserBookings() {
  return apiRequest<{ bookings: any[] }>('/user/bookings');
}

export async function getUserQuotes() {
  return apiRequest<{ quotes: any[] }>('/user/quotes');
}

// Routes API
export async function getRoutes() {
  return apiRequest<{ routes: any[] }>('/routes');
}

export async function getOriginCities() {
  return apiRequest<{ cities: string[] }>('/routes/origins');
}

export async function getDestinationCities(originCity: string) {
  return apiRequest<{ cities: string[] }>(`/routes/destinations/${encodeURIComponent(originCity)}`);
}

// Helicopter Inquiry API
export async function createHelicopterInquiry(data: {
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  message?: string;
}) {
  return apiRequest<any>('/helicopter-inquiry', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
