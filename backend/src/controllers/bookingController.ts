import { Request, Response } from 'express';
import { Booking, Customer, Service } from '../models';
import { BookingStatus, AppointmentType } from '../models/Booking';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import { calculatePrice } from '../utils/priceCalculator';

export const bookingController = {
  // Create a new booking
  async createBooking(req: Request, res: Response) {
    try {
      const {
        customerName,
        customerEmail,
        phone,
        date,
        time,
        serviceType,
        vehicleType,
        vehicleYear,
        vehicleMake,
        vehicleModel,
        condition,
        extras,
        appointmentType,
        notes,
        paymentMethod
      } = req.body;

      // Find or create customer
      let customer = await Customer.findOne({ where: { email: customerEmail } });
      if (!customer) {
        customer = await Customer.create({
          name: customerName,
          email: customerEmail,
          phone,
        });
      }

      // Calculate price
      const price = await calculatePrice({
        serviceType,
        vehicleType,
        extras,
        condition,
      });

      // Generate reference number
      const referenceNumber = `AG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Create booking
      const booking = await Booking.create({
        customerId: customer.id,
        date,
        time,
        serviceType,
        vehicleType,
        vehicleYear,
        vehicleMake,
        vehicleModel,
        condition,
        extras: extras || [],
        appointmentType: appointmentType || AppointmentType.STUDIO,
        totalPrice: price,
        status: BookingStatus.PENDING,
        paymentMethod,
        paymentStatus: 'pending',
        notes,
        referenceNumber,
      });

      // Populate customer info
      const bookingWithCustomer = await Booking.findByPk(booking.id, {
        include: [{ model: Customer, as: 'customer' }]
      });

      res.status(201).json({
        success: true,
        data: bookingWithCustomer,
        message: 'Booking created successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error creating booking',
        error: error.message
      });
    }
  },

  // Get all bookings (with pagination and filtering)
  async getAllBookings(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        dateFrom,
        dateTo,
        customerEmail
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const where: any = {};
      
      if (status) where.status = status;
      if (dateFrom && dateTo) {
        where.date = {
          [Op.between]: [new Date(dateFrom as string), new Date(dateTo as string)]
        };
      }

      const include: any[] = [{ model: Customer, as: 'customer' }];
      
      if (customerEmail) {
        include[0].where = { email: customerEmail };
      }

      const { count, rows } = await Booking.findAndCountAll({
        where,
        include,
        limit: limitNum,
        offset,
        order: [['date', 'DESC']]
      });

      res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: pageNum,
          pages: Math.ceil(count / limitNum),
          limit: limitNum
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching bookings',
        error: error.message
      });
    }
  },

  // Get booking by ID
  async getBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const booking = await Booking.findByPk(id, {
        include: [{ model: Customer, as: 'customer' }]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        data: booking
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching booking',
        error: error.message
      });
    }
  },

  // Get booking by reference number
  async getBookingByReference(req: Request, res: Response) {
    try {
      const { reference } = req.params;
      
      const booking = await Booking.findOne({
        where: { referenceNumber: reference },
        include: [{ model: Customer, as: 'customer' }]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        data: booking
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching booking',
        error: error.message
      });
    }
  },

  // Update booking status
  async updateBookingStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const booking = await Booking.findByPk(id);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      await booking.update({
        status,
        notes: notes || booking.notes
      });

      // If completed, update customer loyalty points
      if (status === BookingStatus.COMPLETED && booking.paymentStatus === 'paid') {
        const customer = await Customer.findByPk(booking.customerId);
        if (customer) {
          const pointsToAdd = Math.floor(booking.totalPrice / 100); // 1 point per R100
          await customer.update({
            loyaltyPoints: customer.loyaltyPoints + pointsToAdd,
            totalSpent: parseFloat(customer.totalSpent.toString()) + parseFloat(booking.totalPrice.toString())
          });
        }
      }

      res.json({
        success: true,
        data: booking,
        message: 'Booking status updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error updating booking',
        error: error.message
      });
    }
  },

  // Update payment status
  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { paymentStatus, paymentMethod } = req.body;

      const booking = await Booking.findByPk(id);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      await booking.update({
        paymentStatus,
        paymentMethod: paymentMethod || booking.paymentMethod
      });

      // If payment is successful, update booking status to confirmed
      if (paymentStatus === 'paid' && booking.status === BookingStatus.PENDING) {
        await booking.update({ status: BookingStatus.CONFIRMED });
      }

      res.json({
        success: true,
        data: booking,
        message: 'Payment status updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error updating payment status',
        error: error.message
      });
    }
  },

  // Get available time slots for a date
  async getAvailableSlots(req: Request, res: Response) {
    try {
      const { date } = req.params;
      
      const bookings = await Booking.findAll({
        where: {
          date: new Date(date),
          status: {
            [Op.in]: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
          }
        },
        attributes: ['time']
      });

      const bookedSlots = bookings.map(b => b.time);
      
      // Define available slots (9 AM to 5 PM, every 2 hours)
      const allSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];
      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

      res.json({
        success: true,
        data: {
          date,
          availableSlots,
          bookedSlots
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching available slots',
        error: error.message
      });
    }
  },

  // Cancel booking
  async cancelBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const booking = await Booking.findByPk(id);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Check if booking can be cancelled
      if (booking.status === BookingStatus.CANCELLED) {
        return res.status(400).json({
          success: false,
          message: 'Booking is already cancelled'
        });
      }

      if (booking.status === BookingStatus.COMPLETED) {
        return res.status(400).json({
          success: false,
          message: 'Completed bookings cannot be cancelled'
        });
      }

      await booking.update({
        status: BookingStatus.CANCELLED,
        notes: reason ? `${booking.notes || ''}\nCancelled: ${reason}` : booking.notes
      });

      res.json({
        success: true,
        data: booking,
        message: 'Booking cancelled successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error cancelling booking',
        error: error.message
      });
    }
  },

  // Get booking statistics
  async getBookingStats(req: Request, res: Response) {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const [
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        monthlyRevenue,
        weeklyBookings,
        todayBookings
      ] = await Promise.all([
        Booking.count(),
        Booking.count({ where: { status: BookingStatus.PENDING } }),
        Booking.count({ where: { status: BookingStatus.CONFIRMED } }),
        Booking.count({ where: { status: BookingStatus.COMPLETED } }),
        Booking.sum('totalPrice', {
          where: {
            status: BookingStatus.COMPLETED,
            date: { [Op.gte]: startOfMonth }
          }
        }),
        Booking.count({
          where: {
            date: { [Op.gte]: startOfWeek }
          }
        }),
        Booking.count({
          where: {
            date: today.toISOString().split('T')[0]
          }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          monthlyRevenue: monthlyRevenue || 0,
          weeklyBookings,
          todayBookings
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching booking statistics',
        error: error.message
      });
    }
  }
};