// Enums matching frontend types
export enum CarType {
  SEDAN = 'SEDAN',
  COUPE = 'COUPE',
  HATCHBACK = 'HATCHBACK',
  SUV = 'SUV',
  TRUCK = 'TRUCK',
  LUXURY = 'LUXURY'
}

export enum CarCondition {
  LIGHT = 'LIGHT',
  MODERATE = 'MODERATE',
  HEAVY = 'HEAVY'
}

export enum ExtraService {
  INTERIOR = 'INTERIOR',
  WAX = 'WAX',
  ENGINE = 'ENGINE'
}

export enum AppointmentType {
  STUDIO = 'studio',
  MOBILE = 'mobile'
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Frontend types matching React components
export interface WashPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  image: string;
}

export interface CarDetails {
  type: CarType;
  year: string;
  make: string;
  model: string;
  condition: CarCondition;
  extras: ExtraService[];
}

export interface BookingDetails {
  date: string;
  time: string;
  customerName: string;
  customerEmail: string;
  appointmentType: AppointmentType;
}

export interface Booking extends BookingDetails {
  id: string;
  referenceNumber: string;
  serviceType: string;
  vehicleType: CarType;
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  condition?: CarCondition;
  extras: ExtraService[];
  totalPrice: number;
  status: BookingStatus;
  paymentMethod?: 'card' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'failed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number; // in minutes
  vehicleTypes: CarType[];
  category: 'basic' | 'deluxe' | 'premium';
  features: string[];
  imageUrl?: string;
  active: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
}

// Request types
export interface CreateBookingRequest {
  customerName: string;
  customerEmail: string;
  phone?: string;
  date: string;
  time: string;
  serviceType: string;
  vehicleType: CarType;
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  condition?: CarCondition;
  extras?: ExtraService[];
  appointmentType?: AppointmentType;
  notes?: string;
  paymentMethod?: 'card' | 'cash';
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
  notes?: string;
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: 'pending' | 'paid' | 'failed';
  paymentMethod?: 'card' | 'cash';
}

export interface CalculatePriceRequest {
  serviceType: string;
  vehicleType: CarType;
  extras: ExtraService[];
  condition?: CarCondition;
}

export interface CalculatePriceResponse {
  service: string;
  vehicleType: CarType;
  condition?: CarCondition;
  extras: ExtraService[];
  basePrice: number;
  vehicleMultiplier: number;
  conditionMultiplier: number;
  extrasTotal: number;
  totalPrice: number;
}

// Statistics types
export interface BookingStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  monthlyRevenue: number;
  weeklyBookings: number;
  todayBookings: number;
}

export interface CustomerStats {
  customer: {
    name: string;
    email: string;
    loyaltyPoints: number;
    totalSpent: number;
  };
  statistics: {
    totalBookings: number;
    completedBookings: number;
    pendingBookings: number;
    cancelledBookings: number;
    averageSpent: number;
    lastBooking: {
      date: string;
      service: string;
      amount: number;
    } | null;
  };
}

// Time slots
export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AvailableSlotsResponse {
  date: string;
  availableSlots: string[];
  bookedSlots: string[];
}

// Email templates
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

// Payment types
export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}

// Filter types
export interface BookingFilters {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  dateFrom?: string;
  dateTo?: string;
  customerEmail?: string;
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
}

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

// AI Recommendation types (for Gemini integration)
export interface AIRecommendationRequest {
  vehicleDetails: CarDetails;
  budget?: number;
  preferences?: string[];
}

export interface AIRecommendationResponse {
  recommendedPackage: string;
  explanation: string;
  estimatedPrice: number;
  durationEstimate: string;
}

// Chatbot types (for AI assistant)
export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export interface ChatContext {
  stage: 'INITIAL' | 'ASK_SIZE' | 'ASK_CONDITION' | 'ASK_MODEL' | 'RECOMMEND' | 'FINAL';
  tempDetails: Partial<CarDetails>;
  conversationId: string;
}

// Configuration types
export interface AppConfig {
  server: {
    port: number;
    nodeEnv: string;
    frontendUrl: string;
  };
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  email: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
  };
  payment: {
    stripeSecretKey: string;
    stripeWebhookSecret: string;
    currency: string;
  };
  jwt: {
    secret: string;
    expiry: string;
  };
}

// Export all types
export type {
  WashPackage,
  CarDetails,
  BookingDetails,
  Booking,
  Customer,
  Service,
  ApiResponse,
  PaginatedResponse,
  CreateBookingRequest,
  UpdateBookingStatusRequest,
  UpdatePaymentStatusRequest,
  CalculatePriceRequest,
  CalculatePriceResponse,
  BookingStats,
  CustomerStats,
  TimeSlot,
  AvailableSlotsResponse,
  EmailTemplate,
  PaymentIntent,
  BookingFilters,
  CustomerFilters,
  ValidationError,
  AIRecommendationRequest,
  AIRecommendationResponse,
  ChatMessage,
  ChatContext,
  AppConfig
};

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type ArrayElement<ArrayType extends readonly unknown[]> = 
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

// Function types
export type AsyncFunction<T = any, R = any> = (arg: T) => Promise<R>;
export type CallbackFunction<T = any, R = any> = (arg: T) => R;