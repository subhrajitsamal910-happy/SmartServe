export type UserRole = 'ROLE_USER' | 'ROLE_PROVIDER' | 'ROLE_ADMIN';

export type AuthResponse = {
  tokenType: string;
  token: string;
  refreshToken: string;
  userId: number;
  name: string;
  email: string;
  role: UserRole;
};

export type CurrentUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export type ServiceProvider = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  available: boolean;
  avatarUrl?: string;
};

export type ServiceItem = {
  id: number;
  title: string;
  description: string;
  category: string;
  providerName: string;
  price: number;
  imageUrl?: string;
  providerAvailable: boolean;
  averageRating: number;
  ratingCount: number;
  bookingCount: number;
};

export type BookingItem = {
  bookingId: number;
  userId: number;
  serviceId: number;
  serviceTitle: string;
  status: 'CONFIRMED' | 'CANCELLED' | 'FLAGGED';
  riskScore: number;
  fraudMessage: string;
  fraudSignals: string[];
  paymentStatus: 'SUCCESS' | 'FAILED' | 'PENDING';
  paymentTransactionId?: string;
  scheduledAt: string;
  durationMinutes: number;
  suggestedRescheduleAt?: string;
  createdAt: string;
};

export type RecommendationResponse = {
  userId: number;
  logicSummary: string;
  recommendedServices: ServiceItem[];
};

export type AnalyticsSummary = {
  totalUsers: number;
  totalBookings: number;
  totalServices: number;
  totalFlaggedBookings: number;
  mostBookedService: string;
  topProviders: { providerName: string; bookingCount: number }[];
};

export type ChatResult = {
  intent: string;
  response: string;
  services: ServiceItem[];
};

export type ChartPoint = {
  label: string;
  value: number;
};
