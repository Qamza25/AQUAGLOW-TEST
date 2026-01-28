import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';
import { validateBooking } from '../middleware/validation';

const router = Router();

// Booking routes
router.post('/', validateBooking, bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.get('/stats', bookingController.getBookingStats);
router.get('/slots/:date', bookingController.getAvailableSlots);
router.get('/:id', bookingController.getBookingById);
router.get('/reference/:reference', bookingController.getBookingByReference);
router.patch('/:id/status', bookingController.updateBookingStatus);
router.patch('/:id/payment', bookingController.updatePaymentStatus);
router.delete('/:id/cancel', bookingController.cancelBooking);

export default router;