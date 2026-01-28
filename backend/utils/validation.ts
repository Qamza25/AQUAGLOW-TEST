import Joi from 'joi';
import { 
  CarType, 
  CarCondition, 
  ExtraService, 
  AppointmentType, 
  BookingStatus 
} from '../types';

export const validationSchemas = {
  // Booking validation
  createBooking: Joi.object({
    customerName: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Customer name is required',
      'string.min': 'Customer name must be at least 2 characters',
      'string.max': 'Customer name must be less than 100 characters'
    }),
    customerEmail: Joi.string().email().required().messages({
      'string.empty': 'Customer email is required',
      'string.email': 'Please enter a valid email address'
    }),
    phone: Joi.string().pattern(/^[0-9\-\+\(\) ]+$/).optional().messages({
      'string.pattern.base': 'Please enter a valid phone number'
    }),
    date: Joi.date().min('now').required().messages({
      'date.base': 'Please enter a valid date',
      'date.min': 'Booking date cannot be in the past'
    }),
    time: Joi.string().pattern(/^(0[9]|1[0-7]):[0-5][0-9] (AM|PM)$/).required().messages({
      'string.empty': 'Time slot is required',
      'string.pattern.base': 'Please select a valid time slot'
    }),
    serviceType: Joi.string().required().messages({
      'string.empty': 'Service type is required'
    }),
    vehicleType: Joi.string().valid(...Object.values(CarType)).required().messages({
      'any.only': 'Please select a valid vehicle type',
      'string.empty': 'Vehicle type is required'
    }),
    vehicleYear: Joi.string().pattern(/^[0-9]{4}$/).optional().messages({
      'string.pattern.base': 'Please enter a valid year (YYYY)'
    }),
    vehicleMake: Joi.string().optional(),
    vehicleModel: Joi.string().optional(),
    condition: Joi.string().valid(...Object.values(CarCondition)).optional().messages({
      'any.only': 'Please select a valid condition'
    }),
    extras: Joi.array().items(Joi.string().valid(...Object.values(ExtraService))).default([]),
    appointmentType: Joi.string().valid(...Object.values(AppointmentType)).default(AppointmentType.STUDIO),
    notes: Joi.string().optional().max(500).messages({
      'string.max': 'Notes must be less than 500 characters'
    }),
    paymentMethod: Joi.string().valid('card', 'cash').optional()
  }),

  // Update booking status
  updateBookingStatus: Joi.object({
    status: Joi.string().valid(...Object.values(BookingStatus)).required(),
    notes: Joi.string().optional().max(500)
  }),

  // Update payment status
  updatePaymentStatus: Joi.object({
    paymentStatus: Joi.string().valid('pending', 'paid', 'failed').required(),
    paymentMethod: Joi.string().valid('card', 'cash').optional()
  }),

  // Service validation
  createService: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).required(),
    basePrice: Joi.number().min(0).required(),
    duration: Joi.number().min(15).required(),
    vehicleTypes: Joi.array().items(Joi.string().valid(...Object.values(CarType))).default([]),
    category: Joi.string().valid('basic', 'deluxe', 'premium').required(),
    features: Joi.array().items(Joi.string()).default([]),
    imageUrl: Joi.string().uri().optional(),
    active: Joi.boolean().default(true)
  }),

  // Customer validation
  createCustomer: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9\-\+\(\) ]+$/).optional(),
    address: Joi.string().optional(),
    loyaltyPoints: Joi.number().min(0).optional(),
    totalSpent: Joi.number().min(0).optional()
  }),

  // Price calculation
  calculatePrice: Joi.object({
    serviceType: Joi.string().required(),
    vehicleType: Joi.string().valid(...Object.values(CarType)).required(),
    extras: Joi.array().items(Joi.string().valid(...Object.values(ExtraService))).default([]),
    condition: Joi.string().valid(...Object.values(CarCondition)).optional()
  }),

  // Pagination
  pagination: Joi.object({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(20),
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Date range
  dateRange: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required().greater(Joi.ref('startDate'))
  }),

  // Search query
  searchQuery: Joi.object({
    query: Joi.string().min(2).required(),
    fields: Joi.array().items(Joi.string()).default(['name', 'email'])
  }),

  // Email validation
  email: Joi.string().email().required(),

  // Phone validation (South Africa)
  phoneSA: Joi.string().pattern(/^(\+27|27|0)[0-9]{9}$/).required(),

  // Password validation
  password: Joi.string()
    .min(8)
    .max(30)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      'string.min': 'Password must be at least 8 characters long',
      'string.max': 'Password must be less than 30 characters long'
    }),

  // URL validation
  url: Joi.string().uri().required(),

  // ID validation (UUID)
  uuid: Joi.string().uuid().required(),

  // Reference number validation
  referenceNumber: Joi.string().pattern(/^AG-[A-Z0-9]+-[A-Z0-9]+$/).required()
};

/**
 * Validate data against a schema
 */
export function validate<T>(data: any, schema: Joi.Schema): { valid: boolean; data?: T; errors?: string[] } {
  const { error, value } = schema.validate(data, { abortEarly: false });
  
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return { valid: false, errors };
  }
  
  return { valid: true, data: value as T };
}

/**
 * Sanitize and validate input
 */
export function sanitizeAndValidate<T>(input: any, schema: Joi.Schema): T {
  const sanitized = JSON.parse(JSON.stringify(input)); // Deep clone
  const result = validate<T>(sanitized, schema);
  
  if (!result.valid) {
    throw new Error(result.errors?.join(', ') || 'Validation failed');
  }
  
  return result.data as T;
}

/**
 * Custom validators
 */
export const customValidators = {
  // Validate South African ID number
  isValidSAId(id: string): boolean {
    // Basic validation - in production use a proper library
    if (!/^\d{13}$/.test(id)) return false;
    
    // Check date part
    const year = parseInt(id.substring(0, 2));
    const month = parseInt(id.substring(2, 4));
    const day = parseInt(id.substring(4, 6));
    
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    return true;
  },

  // Validate credit card number (basic Luhn check)
  isValidCreditCard(cardNumber: string): boolean {
    // Remove all non-digit characters
    const cleaned = cardNumber.replace(/\D/g, '');
    
    // Check if it's a valid length
    if (cleaned.length < 13 || cleaned.length > 19) return false;
    
    // Luhn algorithm
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned.charAt(i), 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  },

  // Validate expiry date (MM/YY format)
  isValidExpiryDate(expiry: string): boolean {
    const match = expiry.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    
    const month = parseInt(match[1], 10);
    const year = parseInt('20' + match[2], 10); // Assuming 21st century
    
    if (month < 1 || month > 12) return false;
    
    const now = new Date();
    const expiryDate = new Date(year, month - 1); // Last day of expiry month
    
    return expiryDate >= now;
  },

  // Validate CVV
  isValidCVV(cvv: string, cardType?: string): boolean {
    const length = cvv.length;
    const isNumeric = /^\d+$/.test(cvv);
    
    if (!isNumeric) return false;
    
    // American Express CVV is 4 digits, others are 3
    if (cardType === 'amex') {
      return length === 4;
    }
    
    return length === 3;
  },

  // Validate vehicle registration (South Africa)
  isValidVehicleRegistration(reg: string): boolean {
    // Basic pattern for South African registrations
    const patterns = [
      /^[A-Z]{2}\s?\d{2}\s?[A-Z]{2}\s?\d{4}$/, // CA 123 AB 1234
      /^[A-Z]{3}\s?\d{3}\s?\d{3}$/, // ABC 123 456
      /^[A-Z]{2}\s?\d{3}\s?-\s?\d{3}$/, // CA 123 - 456
    ];
    
    return patterns.some(pattern => pattern.test(reg.toUpperCase()));
  },

  // Validate VIN (Vehicle Identification Number)
  isValidVIN(vin: string): boolean {
    // Basic VIN validation - in production use a proper library
    if (vin.length !== 17) return false;
    
    // Should not contain I, O, or Q
    if (/[IOQ]/.test(vin.toUpperCase())) return false;
    
    return true;
  }
};

export default {
  validationSchemas,
  validate,
  sanitizeAndValidate,
  customValidators
};