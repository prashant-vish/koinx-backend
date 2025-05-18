import { connect, StringCodec } from "nats";
import { logger } from "../utils/logger.js";

class NatsService {
  constructor() {
    this.nc = null;
    this.sc = StringCodec();
  }

  async connect() {
    try {
      this.nc = await connect({
        servers: process.env.NATS_SERVER || "nats://localhost:4222",
      });
      logger.info("Connected to NATS server");
      return this.nc;
    } catch (error) {
      logger.error("Failed to connect to NATS:", error);
      throw error;
    }
  }

  /**
   * Subscribe to a specific subject
   * @param {string} subject - Subject to subscribe to
   * @param {function} callback - Callback function to handle received messages
   */
  subscribe(subject, callback) {
    if (!this.nc) {
      throw new Error("NATS connection not established");
    }

    const subscription = this.nc.subscribe(subject);
    logger.info(`Subscribed to ${subject}`);

    // Process incoming messages
    (async () => {
      for await (const msg of subscription) {
        try {
          const data = JSON.parse(this.sc.decode(msg.data));
          callback(data);
        } catch (error) {
          logger.error("Error processing NATS message:", error);
        }
      }
    })();

    return subscription;
  }

  /**
   * Publish a message to a specific subject
   * @param {string} subject - Subject to publish to
   * @param {object} data - Data to publish
   */
  publish(subject, data) {
    if (!this.nc) {
      throw new Error("NATS connection not established");
    }

    const jsonData = JSON.stringify(data);
    this.nc.publish(subject, this.sc.encode(jsonData));
    logger.info(`Published message to ${subject}:`, data);
  }

  /**
   * Close the NATS connection
   */
  async close() {
    if (this.nc) {
      await this.nc.drain();
      logger.info("NATS connection closed");
    }
  }
}

export const natsService = new NatsService();
