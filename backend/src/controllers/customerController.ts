import { Request, Response } from 'express';
import { Customer, Booking } from '../models';
import { BookingStatus } from '../models/Booking';
import { Op } from 'sequelize';

export const customerController = {
  // Get all customers
  async getAllCustomers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, search } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const where: any = {};
      
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
          { phone: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Customer.findAndCountAll({
        where,
        limit: limitNum,
        offset,
        order: [['totalSpent', 'DESC']]
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
        message: 'Error fetching customers',
        error: error.message
      });
    }
  },

  // Get customer by ID
  async getCustomerById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const customer = await Customer.findByPk(id, {
        include: [{
          model: Booking,
          as: 'bookings',
          order: [['date', 'DESC']],
          limit: 10
        }]
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        data: customer
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching customer',
        error: error.message
      });
    }
  },

  // Get customer by email
  async getCustomerByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      
      const customer = await Customer.findOne({
        where: { email },
        include: [{
          model: Booking,
          as: 'bookings',
          where: {
            status: {
              [Op.ne]: BookingStatus.CANCELLED
            }
          },
          order: [['date', 'DESC']],
          required: false
        }]
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      res.json({
        success: true,
        data: customer
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching customer',
        error: error.message
      });
    }
  },

  // Update customer
  async updateCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const customer = await Customer.findByPk(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      await customer.update(req.body);

      res.json({
        success: true,
        data: customer,
        message: 'Customer updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error updating customer',
        error: error.message
      });
    }
  },

  // Get customer statistics
  async getCustomerStats(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const customer = await Customer.findByPk(id);
      
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      const bookings = await Booking.findAll({
        where: { customerId: id }
      });

      const completedBookings = bookings.filter(b => b.status === BookingStatus.COMPLETED);
      const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING);
      const cancelledBookings = bookings.filter(b => b.status === BookingStatus.CANCELLED);

      const totalSpent = completedBookings.reduce((sum, booking) => {
        return sum + parseFloat(booking.totalPrice.toString());
      }, 0);

      const averageSpent = completedBookings.length > 0 
        ? totalSpent / completedBookings.length 
        : 0;

      const lastBooking = bookings.length > 0
        ? bookings.reduce((latest, booking) => {
            return new Date(booking.date) > new Date(latest.date) ? booking : latest;
          })
        : null;

      res.json({
        success: true,
        data: {
          customer: {
            name: customer.name,
            email: customer.email,
            loyaltyPoints: customer.loyaltyPoints,
            totalSpent: customer.totalSpent
          },
          statistics: {
            totalBookings: bookings.length,
            completedBookings: completedBookings.length,
            pendingBookings: pendingBookings.length,
            cancelledBookings: cancelledBookings.length,
            averageSpent: Math.round(averageSpent * 100) / 100,
            lastBooking: lastBooking ? {
              date: lastBooking.date,
              service: lastBooking.serviceType,
              amount: lastBooking.totalPrice
            } : null
          }
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching customer statistics',
        error: error.message
      });
    }
  },

  // Search customers
  async searchCustomers(req: Request, res: Response) {
    try {
      const { query } = req.query;
      
      if (!query || query.toString().length < 2) {
        return res.status(400).json({
          success: false,
          message: 'Search query must be at least 2 characters'
        });
      }

      const customers = await Customer.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { email: { [Op.iLike]: `%${query}%` } },
            { phone: { [Op.iLike]: `%${query}%` } }
          ]
        },
        limit: 20,
        order: [['name', 'ASC']]
      });

      res.json({
        success: true,
        data: customers
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error searching customers',
        error: error.message
      });
    }
  }
};