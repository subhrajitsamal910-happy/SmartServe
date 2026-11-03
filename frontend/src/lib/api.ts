import { AnalyticsSummary, AuthResponse, BookingItem, ChartPoint, ChatResult, CurrentUser, RecommendationResponse, ServiceItem, ServiceProvider } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('smartbooking_token');
}

function setSession(auth: AuthResponse) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('smartbooking_token', auth.token);
  localStorage.setItem('smartbooking_refresh_token', auth.refreshToken);
  localStorage.setItem('smartbooking_user', JSON.stringify({
    id: auth.userId,
    name: auth.name,
    email: auth.email,
    role: auth.role
  } satisfies CurrentUser));
}

function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('smartbooking_token');
  localStorage.removeItem('smartbooking_refresh_token');
  localStorage.removeItem('smartbooking_user');
}

async function request<T>(path: string, init?: RequestInit, retry = true): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...(init?.headers || {})
    }
  });

  if (response.status === 401 && retry && typeof window !== 'undefined') {
    const refreshToken = localStorage.getItem('smartbooking_refresh_token');
    if (refreshToken) {
      const refreshed = await refreshSession(refreshToken);
      if (refreshed) {
        return request<T>(path, init, false);
      }
    }
    clearSession();
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const fieldMsgs = payload?.fieldErrors ? Object.values(payload.fieldErrors).join(', ') : null;
    throw new Error(fieldMsgs || payload?.message || payload?.error || 'Request failed');
  }

  return payload as T;
}

async function refreshSession(refreshToken: string): Promise<boolean> {
  try {
    const auth = await request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    }, false);
    setSession(auth);
    return true;
  } catch {
    clearSession();
    return false;
  }
}

export const api = {
  setSession,
  clearSession,
  getSessionUser(): CurrentUser | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('smartbooking_user');
    return raw ? (JSON.parse(raw) as CurrentUser) : null;
  },
  async login(email: string, password: string) {
    const auth = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }, false);
    setSession(auth);
    return auth;
  },
  async register(name: string, email: string, password: string) {
    const user = await request<CurrentUser>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    }, false);
    return user;
  },
  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' }, false);
    } finally {
      clearSession();
    }
  },
  me: () => request<CurrentUser>('/auth/me'),
  listServices: (category?: string) => request<ServiceItem[]>(`/services${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getService: (id: number) => request<ServiceItem>(`/services/${id}`),
  searchServices: (query: string) => request<ServiceItem[]>(`/services/search?q=${encodeURIComponent(query)}`),
  listBookings: () => request<BookingItem[]>('/bookings/my'),
  createBooking: (serviceId: number, scheduledAt: string, durationMinutes = 60) => request<BookingItem>('/bookings', {
    method: 'POST',
    body: JSON.stringify({ serviceId, scheduledAt, durationMinutes })
  }),
  cancelBooking: (bookingId: number) => request<BookingItem>(`/bookings/${bookingId}/cancel`, { method: 'PUT' }),
  recommendations: () => request<RecommendationResponse>('/recommendations/me'),
  chat: (message: string) => request<ChatResult>('/chat', {
    method: 'POST',
    body: JSON.stringify({ message })
  }),
  analytics: () => request<AnalyticsSummary>('/admin/analytics'),
  bookingTrend: (days = 7) => request<ChartPoint[]>(`/admin/analytics/bookings-per-day?days=${days}`),
  topCategories: () => request<ChartPoint[]>('/admin/analytics/top-categories'),
  fraudTrends: (days = 7) => request<ChartPoint[]>(`/admin/analytics/fraud-trends?days=${days}`),
  listProviders: () => request<ServiceProvider[]>('/providers'),
  updateProviderAvailability: (providerId: number, available: boolean) => request<ServiceProvider>(`/providers/${providerId}/availability?available=${available}`, { method: 'PATCH' }),
  uploadProviderAvatar: async (providerId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_BASE}/providers/${providerId}/avatar`, {
      method: 'POST',
      headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : undefined,
      body: formData
    });
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    return response.json() as Promise<ServiceProvider>;
  }
};
