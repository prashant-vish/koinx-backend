import { natsService } from "../services/natsService.js";
import { coingeckoService } from "../services/coingeckoService.js";
import { logger } from "../utils/logger.js";

//  Fetch cryptocurrency data and publish an update event

const publishUpdateEvent = async () => {
  try {
    // First, fetch the latest cryptocurrency data
    // This ensures we have the latest data even if the API server fails to fetch it
    const cryptoStats = await coingeckoService.getCryptoStats();
    logger.info("Fetched latest cryptocurrency stats:", cryptoStats);

    // Simple trigger event as mentioned in the requirements
    const updateEvent = { trigger: "update" };

    // Publish to NATS
    natsService.publish("update", updateEvent);
    logger.info("Published update event to NATS");
  } catch (error) {
    logger.error("Failed to process crypto stats update:", error);
  }
};

/**
 * Start the background job to run every 15 minutes
 */
export const startCryptoStatsJob = () => {
  // Run immediately on startup
  publishUpdateEvent();

  // Schedule to run every 15 minutes (in milliseconds)
  const FIFTEEN_MINUTES = 15 * 60 * 1000;

  setInterval(() => {
    publishUpdateEvent();
  }, FIFTEEN_MINUTES);

  logger.info("Crypto stats background job started - running every 15 minutes");
};
