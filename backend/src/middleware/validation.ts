import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateBooking = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    customerName: Joi.string().min(2).max(100).required(),
    customerEmail: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9\-\+\(\) ]+$/).optional(),
    date: Joi.date().min('now').required(),
    time: Joi.string().pattern(/^(0[9]|1[0-7]):[0-5][0-9] (AM|PM)$/).required(),
    serviceType: Joi.string().required(),
    vehicleType: Joi.string().valid('SEDAN', 'COUPE', 'HATCHBACK', 'SUV', 'TRUCK', 'LUXURY').required(),
    vehicleYear: Joi.string().pattern(/^[0-9]{4}$/).optional(),
    vehicleMake: Joi.string().optional(),
    vehicleModel: Joi.string().optional(),
    condition: Joi.string().valid('LIGHT', 'MODERATE', 'HEAVY').optional(),
    extras: Joi.array().items(Joi.string()).default([]),
    appointmentType: Joi.string().valid('studio', 'mobile').default('studio'),
    notes: Joi.string().optional(),
    paymentMethod: Joi.string().valid('card', 'cash').optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.details[0].message
    });
  }
  
  next();
};

export const validateService = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).required(),
    basePrice: Joi.number().min(0).required(),
    duration: Joi.number().min(15).required(),
    vehicleTypes: Joi.array().items(Joi.string()).default([]),
    category: Joi.string().valid('basic', 'deluxe', 'premium').required(),
    features: Joi.array().items(Joi.string()).default([]),
    imageUrl: Joi.string().uri().optional(),
    active: Joi.boolean().default(true)
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.details[0].message
    });
  }
  
  next();
};

export const validateCustomer = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9\-\+\(\) ]+$/).optional(),
    address: Joi.string().optional(),
    loyaltyPoints: Joi.number().min(0).optional(),
    totalSpent: Joi.number().min(0).optional()
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.details[0].message
    });
  }
  
  next();
};