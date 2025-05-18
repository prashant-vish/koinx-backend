import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router } from "./routes/index.js";
import { logger } from "./utils/logger.js";

import { natsService } from "./services/natsServices.js";
import { storeCryptoStats } from "./controllers/index.js";

const app = express();
dotenv.config();
const PORT = 3000;

const mongo_uri = process.env.MONGO_URI;

async function main() {
  mongoose.connect(mongo_uri).then(() => {
    console.log("database Connected");
  });
}
main().catch((err) => {
  logger.error("Error While connecting to Databae");
});

app.use(express.json());
app.use("/api", router);

app.get("/", (req, res) => {
  res.send({
    msg: "server is running",
  });
});

// Connect to NATS and subscribe to the update event
async function initNatsSubscription() {
  try {
    await natsService.connect();
    logger.info("Connected to NATS server");

    // Subscribe to the 'update' event
    natsService.subscribe("update", (msg) => {
      logger.info("Received update event:", msg);
      storeCryptoStats();
    });
  } catch (error) {
    logger.error("Failed to connect to NATS:", error);
    process.exit(1);
  }
}

app.listen(PORT, async () => {
  logger.info(`Server is running at port ${PORT}`);
  await initNatsSubscription();
});

// Handle graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Shutting down API server...");
  await natsService.close();
  await mongoose.connection.close();
  process.exit(0);
});
