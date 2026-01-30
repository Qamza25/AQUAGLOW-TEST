import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { 
  CarType, 
  CarCondition, 
  ExtraService, 
  AppointmentType,
  BookingStatus 
} from '../types';
import logger from './logger';

/**
 * Generate a unique reference number for bookings
 */
export function generateReferenceNumber(prefix: string = 'AG'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generate a short booking ID for display purposes
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

/**
 * Format price to South African Rand
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate total price based on vehicle type, condition, and extras
 */
export function calculateTotalPrice(
  basePrice: number,
  vehicleType: CarType,
  condition: CarCondition = CarCondition.LIGHT,
  extras: ExtraService[] = []
): number {
  // Vehicle type multipliers
  const vehicleMultipliers: Record<CarType, number> = {
    [CarType.SEDAN]: 1.0,
    [CarType.COUPE]: 1.1,
    [CarType.HATCHBACK]: 1.0,
    [CarType.SUV]: 1.3,
    [CarType.TRUCK]: 1.5,
    [CarType.LUXURY]: 1.8,
  };

  // Condition multipliers
  const conditionMultipliers: Record<CarCondition, number> = {
    [CarCondition.LIGHT]: 1.0,
    [CarCondition.MODERATE]: 1.2,
    [CarCondition.HEAVY]: 1.5,
  };

  // Extra service prices
  const extraPrices: Record<ExtraService, number> = {
    [ExtraService.INTERIOR]: 150,
    [ExtraService.WAX]: 200,
    [ExtraService.ENGINE]: 300,
  };

  let totalPrice = basePrice;

  // Apply vehicle type multiplier
  const vehicleMultiplier = vehicleMultipliers[vehicleType] || 1.0;
  totalPrice *= vehicleMultiplier;

  // Apply condition multiplier
  const conditionMultiplier = conditionMultipliers[condition] || 1.0;
  totalPrice *= conditionMultiplier;

  // Add extra services
  const extrasTotal = extras.reduce((sum, extra) => {
    return sum + (extraPrices[extra] || 0);
  }, 0);
  totalPrice += extrasTotal;

  // Round to 2 decimal places
  return Math.round(totalPrice * 100) / 100;
}

/**
 * Format date to display format
 */
export function formatDate(date: Date | string, includeTime: boolean = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }

  return dateObj.toLocaleDateString('en-ZA', options);
}

/**
 * Check if a date is valid for booking (not in past, within 90 days)
 */
export function isValidBookingDate(date: Date | string): { valid: boolean; message?: string } {
  const bookingDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 90);

  if (bookingDate < today) {
    return { valid: false, message: 'Booking date cannot be in the past' };
  }

  if (bookingDate > maxDate) {
    return { valid: false, message: 'Booking date cannot be more than 90 days in the future' };
  }

  return { valid: true };
}

/**
 * Check if a time slot is valid
 */
export function isValidTimeSlot(time: string): boolean {
  const timeRegex = /^(0[9]|1[0-7]):[0-5][0-9] (AM|PM)$/;
  return timeRegex.test(time);
}

/**
 * Get available time slots for a given date
 */
export function getAvailableTimeSlots(): string[] {
  return ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(payload: object, expiresIn: string = '7d'): string {
  // Use config.JWT_SECRET if it exists, otherwise use a fallback
  const secret = config.JWT_SECRET || process.env.JWT_SECRET || 'your-jwt-secret-key';
  return jwt.sign(payload, secret, { expiresIn });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): any {
  try {
    // Use config.JWT_SECRET if it exists, otherwise use a fallback
    const secret = config.JWT_SECRET || process.env.JWT_SECRET || 'your-jwt-secret-key';
    return jwt.verify(token, secret);
  } catch (error) {
    logger.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Generate a random color for UI elements
 */
export function generateRandomColor(): string {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#06B6D4', // Cyan
    '#F97316', // Orange
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Debounce function for limiting API calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for limiting API calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastFunc: NodeJS.Timeout | null = null;
  let lastRan: number | null = null;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    } else {
      if (lastFunc) clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - (lastRan || 0) >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - (lastRan || 0)));
    }
  };
}

/**
 * Generate a progress percentage for booking status
 */
export function getBookingProgress(status: BookingStatus): number {
  const progressMap: Record<BookingStatus, number> = {
    [BookingStatus.PENDING]: 25,
    [BookingStatus.CONFIRMED]: 50,
    [BookingStatus.COMPLETED]: 100,
    [BookingStatus.CANCELLED]: 0,
  };
  
  return progressMap[status] || 0;
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: BookingStatus): string {
  const colorMap: Record<BookingStatus, string> = {
    [BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [BookingStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
    [BookingStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [BookingStatus.CANCELLED]: 'bg-red-100 text-red-800',
  };
  
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Calculate estimated completion time
 */
export function calculateCompletionTime(
  startTime: string,
  duration: number, // in minutes
  appointmentType: AppointmentType
): string {
  const [time, period] = startTime.split(' ');
  const [hoursStr, minutesStr] = time.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  
  // Convert to 24-hour format
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  const startDate = new Date();
  startDate.setHours(hours, minutes, 0, 0);
  
  // Add buffer based on appointment type
  const buffer = appointmentType === AppointmentType.MOBILE ? 30 : 15;
  const totalDuration = duration + buffer;
  
  const endDate = new Date(startDate.getTime() + totalDuration * 60000);
  
  const endHours = endDate.getHours();
  const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
  const endPeriod = endHours >= 12 ? 'PM' : 'AM';
  const displayHours = endHours % 12 || 12;
  
  return `${displayHours}:${endMinutes} ${endPeriod}`;
}

/**
 * Generate a friendly greeting based on time of day
 */
export function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's a South African number
  if (cleaned.startsWith('27') && cleaned.length === 11) {
    return `+${cleaned.substring(0, 2)} ${cleaned.substring(2, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  }
  
  // Default formatting
  return phone;
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate a CSV string from data
 */
export function generateCSV(data: any[], headers?: string[]): string {
  if (!data.length) return '';
  
  const csvHeaders = headers || Object.keys(data[0]);
  const csvRows = data.map(row => 
    csvHeaders.map(header => {
      const value = row[header];
      // Handle values that might contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  
  return [csvHeaders.join(','), ...csvRows].join('\n');
}

/**
 * Parse query parameters to filters
 */
export function parseQueryParams(query: any): any {
  const filters: any = {};
  
  Object.keys(query).forEach(key => {
    const value = query[key];
    
    if (typeof value === 'string') {
      // Handle pagination
      if (key === 'page' || key === 'limit') {
        filters[key] = parseInt(value, 10);
      }
      // Handle booleans
      else if (value === 'true' || value === 'false') {
        filters[key] = value === 'true';
      }
      // Handle arrays (comma-separated)
      else if (value.includes(',')) {
        filters[key] = value.split(',').map((v: string) => v.trim());
      }
      // Handle dates
      else if (key.includes('date') || key.includes('Date')) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          filters[key] = date;
        } else {
          filters[key] = value;
        }
      }
      // Default to string
      else {
        filters[key] = value;
      }
    } else {
      filters[key] = value;
    }
  });
  
  return filters;
}

/**
 * Sleep/wait function for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error = new Error('Retry failed');
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      logger.warn(`Attempt ${i + 1} failed:`, error);
      
      if (i < maxRetries - 1) {
        const waitTime = delay * Math.pow(2, i); // Exponential backoff
        await sleep(waitTime);
      }
    }
  }
  
  throw lastError;
}

/**
 * Generate a password reset token
 */
export function generateResetToken(): string {
  return uuidv4().replace(/-/g, '');
}

/**
 * Calculate loyalty points based on purchase amount
 */
export function calculateLoyaltyPoints(amount: number): number {
  return Math.floor(amount / 100); // 1 point per R100
}

/**
 * Get the next available booking date
 */
export function getNextAvailableDate(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 1); // Tomorrow
  
  // Skip weekends if needed (optional)
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  
  return date;
}

/**
 * Group bookings by date for calendar view
 */
export function groupBookingsByDate(bookings: any[]): Record<string, any[]> {
  return bookings.reduce((groups, booking) => {
    const date = new Date(booking.date).toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(booking);
    return groups;
  }, {} as Record<string, any[]>);
}