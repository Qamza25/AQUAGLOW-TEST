import { createApp } from './app';
import { config } from './config/env';
import sequelize from './config/database';
import logger from './utils/logger';

async function startServer() {
  try {
    console.log('🚀 Starting AquaGlow Backend...');
    console.log(`📁 Environment: ${config.NODE_ENV}`);
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Load models
    console.log('🔄 Loading models...');
    await import('./models/index');
    
    // Sync database models - DISABLE ALTER FOR NOW
    console.log('🔄 Syncing database...');
    await sequelize.sync({ 
      alter: false,  // Changed from true to false
      force: false
    });
    console.log('✅ Database synchronized');
    
    // Create and start Express app
    const app = createApp();
    
    const server = app.listen(config.PORT, () => {
      console.log('\n' + '='.repeat(50));
      console.log('🎉 AquaGlow Backend Started Successfully!');
      console.log('='.repeat(50));
      console.log(`📡 Port: ${config.PORT}`);
      console.log(`🌐 API URL: http://localhost:${config.PORT}/api`);
      console.log(`🏥 Health Check: http://localhost:${config.PORT}/health`);
      console.log(`👤 Database User: ${config.DB_USER}`);
      console.log(`🗄️  Database: ${config.DB_NAME}`);
      console.log(`🏠 Database Host: ${config.DB_HOST}:${config.DB_PORT}`);
      console.log('='.repeat(50) + '\n');
      
      logger.info(`Server running on port ${config.PORT}`);
    });
    
    // Graceful shutdown
    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received: shutting down gracefully...`);
      logger.info(`${signal} signal received`);
      
      server.close(async () => {
        console.log('✅ HTTP server closed');
        
        try {
          await sequelize.close();
          console.log('✅ Database connection closed');
          logger.info('Server shutdown complete');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error closing database:', error);
          process.exit(1);
        }
      });
      
      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('❌ Could not close connections in time, forcing shutdown');
        process.exit(1);
      }, 10000);
    };
    
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    
  } catch (error: any) {
    console.error('\n❌ Failed to start server!');
    console.error('='.repeat(50));
    console.error('Error:', error.message);
    
    if (error.name === 'SequelizeConnectionError') {
      console.error('\n🔧 Database Connection Troubleshooting:');
      console.error('1. Is PostgreSQL running?');
      console.error('2. Check .env file credentials');
      console.error(`3. Try: psql -h ${config.DB_HOST} -U ${config.DB_USER} -d ${config.DB_NAME}`);
    }
    
    console.error('='.repeat(50));
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();