import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import bookingRoutes from './routes/bookingRoutes';
import serviceRoutes from './routes/serviceRoutes';
import customerRoutes from './routes/customerRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';

export const createApp = () => {
  const app = express();

  // Security middleware
  app.use(helmet());
  
  // CORS configuration
  app.use(cors({
    origin: config.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  
  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  });
  
  app.use('/api/', limiter);
  
  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Compression
  app.use(compression());
  
  // Request logging
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
  });
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'AquaGlow API',
      version: '1.0.0'
    });
  });
  
  // Root API endpoint - Welcome message
  app.get('/api', (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to AquaGlow API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        bookings: '/api/bookings',
        services: '/api/services',
        customers: '/api/customers'
      },
      documentation: 'https://api.aquaglow.com/docs'
    });
  });
  
  // API routes
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/customers', customerRoutes);
  
  // Handle 404
  app.use(notFoundHandler);
  
  // Error handling
  app.use(errorHandler);
  
  return app;
};