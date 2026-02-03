import { z } from 'zod';

// Correct pattern for 12-hour time with optional leading zero, space before AM/PM is optional
// Examples that pass: "9:30 AM", "09:30 AM", "10:45 PM", "12:00 AM", "1:05 PM"
// Examples that fail: "13:00 PM", "9:60 AM", "09:30", "9:30am" (lowercase), " 9:30 AM"
const time12HourPattern = /^(0?[1-9]|1[0-2]):[0-5]\d\s*(AM|PM)$/i;

export const bookingSchema = z.object({
  customerName: z.string().min(1, "Name is required"),
  customerEmail: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  date: z.string().min(1, "Date is required"),

  // ────────────────────────────────────────────────
  // This is the corrected time field
  time: z.string().regex(
    time12HourPattern,
    "Time must be in format h:mm AM/PM or hh:mm AM/PM (e.g. 9:30 AM, 10:45 PM, 12:00 AM)"
  ),
  // ────────────────────────────────────────────────

  serviceType: z.string().min(1, "Service type is required"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  vehicleYear: z.string().optional(),
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  condition: z.string().optional(),
  extras: z.array(z.string()).optional(),
  appointmentType: z.enum(['studio', 'mobile']),
  notes: z.string().optional(),
  paymentMethod: z.enum(['card', 'cash']),
  base_price: z.number().optional(),
});