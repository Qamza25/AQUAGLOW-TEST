import { Request, Response } from 'express';
import { Booking, Customer, Service } from '../models';
import { BookingStatus, AppointmentType } from '../models/Booking';
import { Op, fn, col } from 'sequelize';
import { calculatePrice } from '../utils/priceCalculator';

export const bookingController = {
  // ================================
  // CREATE BOOKING
  // ================================
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

      // ============ VALIDATION START ============
      // 1. Validate time format (24-hour HH:MM)
      const timeRegex = /^([0-1]\d|2[0-3]):[0-5]\d$/;
      if (!timeRegex.test(time)) {
        return res.status(400).json({
          success: false,
          message: 'Time must be in 24-hour format (HH:MM) e.g., 14:30'
        });
      }

      // 2. Validate required fields
      const requiredFields = {
        customerName,
        customerEmail,
        date,
        time,
        serviceType,
        vehicleType,
        paymentMethod
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value || value.trim() === '')
        .map(([key]) => key);

      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        });
      }

      // 3. Validate appointment type
      const validAppointmentTypes = ['studio', 'mobile'];
      if (appointmentType && !validAppointmentTypes.includes(appointmentType.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Appointment type must be "studio" or "mobile"'
        });
      }

      // 4. Validate payment method
      const validPaymentMethods = ['card', 'cash'];
      if (!validPaymentMethods.includes(paymentMethod.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: 'Payment method must be "card" or "cash"'
        });
      }
      // ============ VALIDATION END ============

      // 1️⃣ Get service (for duration)
      const service = await Service.findOne({ where: { name: serviceType } });
      if (!service) {
        return res.status(400).json({
          success: false,
          message: 'Invalid service type'
        });
      }

      // 2️⃣ Compute combined datetime
      const bookingDateTime = new Date(`${date} ${time}`);

      // 3️⃣ Find or create customer
      let customer = await Customer.findOne({ where: { email: customerEmail } });
      if (!customer) {
        customer = await Customer.create({
          name: customerName,
          email: customerEmail,
          phone: phone || ''
        });
      }

      // 4️⃣ Calculate price
      const price = await calculatePrice({
        serviceType,
        vehicleType,
        extras,
        condition
      });

      // 5️⃣ Generate reference number
      const referenceNumber = `AG-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`;

      // 6️⃣ Create booking with proper typing
      const booking = await Booking.create({
        customerId: customer.id,
        date,
        time,
        serviceType,
        vehicleType,
        vehicleYear: vehicleYear || null,
        vehicleMake: vehicleMake || null,
        vehicleModel: vehicleModel || null,
        condition: condition || null,
        extras: extras || [],
        appointmentType: (appointmentType || AppointmentType.STUDIO).toLowerCase(),
        totalPrice: price,
        status: BookingStatus.PENDING,
        paymentMethod: paymentMethod.toLowerCase(),
        paymentStatus: 'pending',
        notes: notes || null,
        referenceNumber,
        scheduledAt: bookingDateTime
      } as any);

      const bookingWithCustomer = await Booking.findByPk(booking.id, {
        include: [{ model: Customer, as: 'customer' }]
      });

      res.status(201).json({
        success: true,
        data: bookingWithCustomer,
        message: 'Booking created successfully'
      });

    } catch (error: any) {
      console.error('Create booking error:', error);
      
      // 🔒 Double booking protection
      if (error.name === 'SequelizeUniqueConstraintError' || error.code === '23505') {
        return res.status(409).json({
          success: false,
          message: 'Selected time slot is already booked'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error creating booking',
        error: error.message
      });
    }
  },

  // ================================
  // GET ALL BOOKINGS
  // ================================
  async getAllBookings(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        status,
        customerEmail,
        startDate,
        endDate
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const where: any = {};
      if (status) where.status = status;
      
      // Date filtering - use date field
      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date[Op.gte] = startDate as string;
        if (endDate) where.date[Op.lte] = endDate as string;
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
        order: [['createdAt', 'DESC']]
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

  // ================================
  // GET BOOKING BY ID
  // ================================
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

      res.json({ success: true, data: booking });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching booking',
        error: error.message
      });
    }
  },

  // ================================
  // GET BOOKING BY REFERENCE
  // ================================
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

      res.json({ success: true, data: booking });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching booking',
        error: error.message
      });
    }
  },

  // ================================
  // GET BOOKING STATISTICS
  // ================================
  async getBookingStats(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      
      // Build date filter if provided
      const dateFilter: any = {};
      if (startDate || endDate) {
        dateFilter.date = {};
        if (startDate) dateFilter.date[Op.gte] = startDate as string;
        if (endDate) dateFilter.date[Op.lte] = endDate as string;
      }

      // Get total count
      const totalBookings = await Booking.count({ where: dateFilter });
      
      // Get today's bookings
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      const todayBookings = await Booking.count({
        where: {
          ...dateFilter,
          date: todayStr
        }
      });
      
      // Get counts by status
      const statusCounts: any = await Booking.findAll({
        where: dateFilter,
        attributes: [
          'status',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['status'],
        raw: true
      });
      
      // Convert to object format
      const statusStats: Record<string, number> = {};
      statusCounts.forEach((item: any) => {
        statusStats[item.status] = parseInt(item.count);
      });
      
      // Get counts by service type
      const serviceCounts: any = await Booking.findAll({
        where: dateFilter,
        attributes: [
          'serviceType',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['serviceType'],
        raw: true
      });
      
      // Get revenue statistics
      const revenueResult: any = await Booking.findOne({
        where: {
          ...dateFilter,
          paymentStatus: 'paid'
        },
        attributes: [
          [fn('COALESCE', fn('SUM', col('totalPrice')), 0), 'totalRevenue'],
          [fn('AVG', col('totalPrice')), 'averageRevenue']
        ],
        raw: true
      });
      
      // Get bookings by vehicle type
      const vehicleTypeCounts: any = await Booking.findAll({
        where: dateFilter,
        attributes: [
          'vehicleType',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['vehicleType'],
        raw: true
      });
      
      // Get recent bookings (last 10)
      const recentBookings = await Booking.findAll({
        where: dateFilter,
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [{
          model: Customer,
          as: 'customer',
          attributes: ['name', 'email', 'phone']
        }]
      });
      
      // Get daily bookings for the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
      
      const dailyBookingsResult: any = await Booking.findAll({
        where: {
          ...dateFilter,
          date: {
            [Op.gte]: sevenDaysAgoStr
          }
        },
        attributes: [
          'date',
          [fn('COUNT', col('id')), 'count']
        ],
        group: ['date'],
        order: [['date', 'ASC']],
        raw: true
      });
      
      // Get top customers by bookings
      const topCustomersResult = await Booking.findAll({
        where: dateFilter,
        attributes: [
          'customerId',
          [fn('COUNT', col('id')), 'bookingCount'],
          [fn('SUM', col('totalPrice')), 'totalSpent']
        ],
        group: ['customerId'],
        order: [[fn('COUNT', col('id')), 'DESC']],
        limit: 5,
        include: [{
          model: Customer,
          as: 'customer',
          attributes: ['name', 'email']
        }]
      });

      // Format the response
      const topCustomers = topCustomersResult.map((item: any) => ({
        customer: item.customer,
        bookingCount: parseInt(item.get('bookingCount')),
        totalSpent: parseFloat(item.get('totalSpent') || '0')
      }));

      res.json({
        success: true,
        data: {
          summary: {
            total: totalBookings,
            today: todayBookings,
            totalRevenue: parseFloat(revenueResult?.totalRevenue || '0'),
            averageRevenue: parseFloat(revenueResult?.averageRevenue || '0')
          },
          byStatus: statusStats,
          byService: serviceCounts.map((item: any) => ({
            serviceType: item.serviceType,
            count: parseInt(item.count)
          })),
          byVehicleType: vehicleTypeCounts.map((item: any) => ({
            vehicleType: item.vehicleType,
            count: parseInt(item.count)
          })),
          dailyTrends: dailyBookingsResult.map((item: any) => ({
            date: item.date,
            count: parseInt(item.count)
          })),
          recentBookings,
          topCustomers
        }
      });
    } catch (error: any) {
      console.error('Error fetching booking stats:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching booking statistics',
        error: error.message
      });
    }
  },

  // ================================
  // UPDATE BOOKING STATUS
  // ================================
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

      // Loyalty points on completion
      if (status === BookingStatus.COMPLETED && booking.paymentStatus === 'paid') {
        const customer = await Customer.findByPk(booking.customerId);
        if (customer) {
          const pointsToAdd = Math.floor(booking.totalPrice / 100);
          await customer.update({
            loyaltyPoints: (customer.loyaltyPoints || 0) + pointsToAdd,
            totalSpent: Number(customer.totalSpent || 0) + Number(booking.totalPrice)
          });
        }
      }

      res.json({
        success: true,
        data: booking,
        message: 'Booking status updated'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error updating booking status',
        error: error.message
      });
    }
  },

  // ================================
  // UPDATE PAYMENT STATUS
  // ================================
  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { paymentStatus, paymentMethod, transactionId } = req.body;

      const booking = await Booking.findByPk(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      const updateData: any = {
        paymentStatus,
        paymentMethod: paymentMethod || booking.paymentMethod
      };

      if (transactionId) {
        updateData.transactionId = transactionId;
      }

      await booking.update(updateData);

      if (
        paymentStatus === 'paid' &&
        booking.status === BookingStatus.PENDING
      ) {
        await booking.update({ status: BookingStatus.CONFIRMED });
      }

      res.json({
        success: true,
        data: booking,
        message: 'Payment status updated'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error updating payment status',
        error: error.message
      });
    }
  },

  // ================================
  // GET AVAILABLE SLOTS
  // ================================
  async getAvailableSlots(req: Request, res: Response) {
    try {
      const { date } = req.params;
      const { duration = 60 } = req.query; // duration in minutes
      
      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Date parameter is required'
        });
      }

      const openHour = 8; // 8 AM
      const closeHour = 18; // 6 PM
      const slotMinutes = 30;

      // Get bookings for the day
      const bookings = await Booking.findAll({
        where: {
          status: {
            [Op.in]: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
          },
          date: date
        }
      });

      const availableSlots: string[] = []; // Just store time strings (HH:MM format)
      const durationMs = parseInt(duration as string) * 60 * 1000;

      for (let h = openHour; h < closeHour; h++) {
        for (let m = 0; m < 60; m += slotMinutes) {
          const slotTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          const start = new Date(`${date} ${slotTime}:00`);
          const end = new Date(start.getTime() + durationMs);

          // Skip if end time is after closing
          if (end.getHours() >= closeHour) continue;

          // Check for time conflicts
          const conflict = bookings.some((booking: any) => {
            const bookingTime = booking.time;
            if (!bookingTime) return false;
            
            // Convert to comparable format
            const bookingTimeStr = typeof bookingTime === 'string' 
              ? bookingTime.trim()
              : bookingTime.toTimeString().slice(0, 5);
            
            return slotTime === bookingTimeStr;
          });

          if (!conflict) {
            availableSlots.push(slotTime); // Push the time string in HH:MM format
          }
        }
      }

      res.json({
        success: true,
        data: {
          date,
          duration: parseInt(duration as string),
          availableSlots, // Array of time strings like ["08:00", "08:30", ...]
          totalSlots: availableSlots.length
        }
      });
    } catch (error: any) {
      console.error('Error fetching available slots:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching available slots',
        error: error.message
      });
    }
  },

  // ================================
  // CANCEL BOOKING
  // ================================
  async cancelBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason, refundAmount } = req.body;

      const booking = await Booking.findByPk(id);
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      if (
        booking.status === BookingStatus.CANCELLED ||
        booking.status === BookingStatus.COMPLETED
      ) {
        return res.status(400).json({
          success: false,
          message: 'Booking cannot be cancelled'
        });
      }

      const updateData: any = {
        status: BookingStatus.CANCELLED
      };

      if (reason) {
        updateData.notes = `${booking.notes || ''}\nCancelled: ${reason}`;
      }

      if (refundAmount && booking.paymentStatus === 'paid') {
        updateData.refundAmount = refundAmount;
        updateData.refundStatus = 'pending';
      }

      await booking.update(updateData);

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

  // ================================
  // SEARCH BOOKINGS
  // ================================
  async searchBookings(req: Request, res: Response) {
    try {
      const { q, status, startDate, endDate } = req.query;
      
      const where: any = {};
      
      if (status) where.status = status;
      
      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date[Op.gte] = startDate as string;
        if (endDate) where.date[Op.lte] = endDate as string;
      }
      
      if (q) {
        const searchQuery = `%${q}%`;
        where[Op.or] = [
          { referenceNumber: { [Op.iLike]: searchQuery } },
          { serviceType: { [Op.iLike]: searchQuery } },
          { vehicleModel: { [Op.iLike]: searchQuery } }
        ];
      }
      
      const bookings = await Booking.findAll({
        where,
        include: [{
          model: Customer,
          as: 'customer',
          where: q ? {
            [Op.or]: [
              { name: { [Op.iLike]: `%${q}%` } },
              { email: { [Op.iLike]: `%${q}%` } }
            ]
          } : undefined,
          attributes: ['name', 'email', 'phone']
        }],
        order: [['createdAt', 'DESC']],
        limit: 50
      });
      
      res.json({
        success: true,
        data: bookings,
        count: bookings.length
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error searching bookings',
        error: error.message
      });
    }
  },

  // ================================
  // DEBUG: GET MODEL FIELDS
  // ================================
  async debugModelFields(req: Request, res: Response) {
    try {
      // Get one booking to see its structure
      const booking = await Booking.findOne();
      if (booking) {
        const bookingJson = booking.toJSON();
        res.json({
          success: true,
          fields: Object.keys(bookingJson),
          sample: bookingJson
        });
      } else {
        // Check model attributes
        res.json({
          success: true,
          modelAttributes: Object.keys(Booking.rawAttributes),
          rawAttributes: Booking.rawAttributes
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error debugging model',
        error: error.message
      });
    }
  }
};