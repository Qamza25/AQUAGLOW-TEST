import { Request, Response } from 'express';
import { Service } from '../models';

export const serviceController = {
  // Get all services
  async getAllServices(req: Request, res: Response) {
    try {
      const services = await Service.findAll({
        where: { active: true },
        order: [['basePrice', 'ASC']]
      });

      res.json({
        success: true,
        data: services
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching services',
        error: error.message
      });
    }
  },

  // Get service by ID
  async getServiceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const service = await Service.findByPk(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      res.json({
        success: true,
        data: service
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error fetching service',
        error: error.message
      });
    }
  },

  // Create new service
  async createService(req: Request, res: Response) {
    try {
      const service = await Service.create(req.body);

      res.status(201).json({
        success: true,
        data: service,
        message: 'Service created successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error creating service',
        error: error.message
      });
    }
  },

  // Update service
  async updateService(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const service = await Service.findByPk(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      await service.update(req.body);

      res.json({
        success: true,
        data: service,
        message: 'Service updated successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error updating service',
        error: error.message
      });
    }
  },

  // Delete service (soft delete)
  async deleteService(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const service = await Service.findByPk(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      await service.update({ active: false });

      res.json({
        success: true,
        message: 'Service deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error deleting service',
        error: error.message
      });
    }
  },

  // Calculate price
  async calculatePrice(req: Request, res: Response) {
    try {
      const { serviceType, vehicleType, extras = [], condition } = req.body;

      const service = await Service.findOne({
        where: { name: serviceType, active: true }
      });

      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Service not found'
        });
      }

      // Vehicle type multipliers
      const vehicleMultipliers: Record<string, number> = {
        'SEDAN': 1.0,
        'COUPE': 1.1,
        'HATCHBACK': 1.0,
        'SUV': 1.3,
        'TRUCK': 1.5,
        'LUXURY': 1.8
      };

      // Condition multipliers
      const conditionMultipliers: Record<string, number> = {
        'LIGHT': 1.0,
        'MODERATE': 1.2,
        'HEAVY': 1.5
      };

      // Extra service prices
      const extraPrices: Record<string, number> = {
        'INTERIOR': 150,
        'WAX': 200,
        'ENGINE': 300
      };

      let totalPrice = service.basePrice;

      // Apply vehicle type multiplier
      const vehicleMultiplier = vehicleMultipliers[vehicleType.toUpperCase()] || 1.0;
      totalPrice *= vehicleMultiplier;

      // Apply condition multiplier
      const conditionMultiplier = conditionMultipliers[condition?.toUpperCase()] || 1.0;
      totalPrice *= conditionMultiplier;

      // Add extra services
      const extrasTotal = extras.reduce((sum: number, extra: string) => {
        return sum + (extraPrices[extra] || 0);
      }, 0);
      totalPrice += extrasTotal;

      res.json({
        success: true,
        data: {
          service: service.name,
          vehicleType,
          condition,
          extras,
          basePrice: service.basePrice,
          vehicleMultiplier,
          conditionMultiplier,
          extrasTotal,
          totalPrice: Math.round(totalPrice * 100) / 100 // Round to 2 decimal places
        }
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Error calculating price',
        error: error.message
      });
    }
  }
};