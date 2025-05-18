// worker-server/index.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const natsService = require('./src/services/natsService');
const { startCryptoStatsJob } = require('./src/jobs/cryptoStatsJob');
const logger = require('./src/utils/logger');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('MongoDB connection error:', err));

// Initialize NATS connection
async function initNats() {
  try {
    await natsService.connect();
    logger.info('Connected to NATS server');
  } catch (error) {
    logger.error('Failed to connect to NATS:', error);
    process.exit(1);
  }
}

// Start the worker server
async function startServer() {
  try {
    // Initialize NATS
    await initNats();
    
    // Start background job
    startCryptoStatsJob();
    
    logger.info('Worker server started successfully');
  } catch (error) {
    logger.error('Error starting worker server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Shutting down worker server...');
  await natsService.close();
  await mongoose.connection.close();
  process.exit(0);
});

// Start the server
startServer();