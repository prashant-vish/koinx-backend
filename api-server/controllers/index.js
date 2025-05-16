import axios from "axios";
import { logger } from "../utils/logger.js";
import { CryptoStats } from "../models/db.js";
import dotenv from "dotenv";
dotenv.config();

const CRYPTO_COINS = ["bitcoin", "ethereum", "matic-network"];
const COINGECKO_API = process.env.COINGECKO_API;

export async function storeCryptoStats(req, res) {
  try {
    logger.info("Fetching cryptocurrency stats from CoinGecko");

    // Fetch data for all coins in a single request to minimize API calls
    const response = await axios.get(COINGECKO_API, {
      params: {
        vs_currency: "usd",
        ids: CRYPTO_COINS.join(","),
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: false,
        price_change_percentage: "24h",
      },
    });

    // Process and store each coin's data
    const updatePromises = response.data.map(async (coin) => {
      const stats = {
        coin: coin.id,
        price: coin.current_price,
        marketCap: coin.market_cap,
        "24hChange": coin.price_change_percentage_24h || 0,
        timestamp: new Date(),
      };

      // Save to database
      await CryptoStats.create(stats);
      logger.info(`Stored stats for ${coin.id}:`, stats);

      return stats;
    });

    await Promise.all(updatePromises);
    logger.info("All cryptocurrency stats stored successfully");

    return res.send({ success: true, message: "Cryptocurrency stats updated" });
  } catch (error) {
    logger.error("Error storing cryptocurrency stats:", error);
    throw new Error("Failed to store cryptocurrency stats");
  }
}

export async function getLatestStats(req, res) {
  try {
    const { coin } = req.query;

    if (!coin || !CRYPTO_COINS.includes(coin)) {
      return res.status(400).json({
        error: `Invalid coin. Please use one of: ${CRYPTO_COINS.join(", ")}`,
      });
    }

    // Get the most recent record for the requested coin
    const latestStats = await CryptoStats.findOne({ coin }).sort({
      timestamp: -1,
    });

    if (!latestStats) {
      return res.status(404).json({ error: `No stats found for ${coin}` });
    }

    return res.json({
      price: latestStats.price,
      marketCap: latestStats.marketCap,
      "24hChange": latestStats["24hChange"],
    });
  } catch (error) {
    logger.error("Error fetching latest stats:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
export async function getStandardDeviation(req, res) {
  try {
    const { coin } = req.query;

    if (!coin || !CRYPTO_COINS.includes(coin)) {
      return res.status(400).json({
        error: `Invalid coin. Please use one of: ${CRYPTO_COINS.join(", ")}`,
      });
    }

    // Get the last 100 records for the requested coin
    const records = await CryptoStats.find({ coin })
      .sort({ timestamp: -1 })
      .limit(100);

    if (!records.length) {
      return res.status(404).json({ error: `No records found for ${coin}` });
    }

    // Extract prices from records
    const prices = records.map((record) => record.price);

    // Calculate standard deviation
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const squaredDifferences = prices.map((price) => Math.pow(price - mean, 2));
    const variance =
      squaredDifferences.reduce((sum, sqDiff) => sum + sqDiff, 0) /
      prices.length;
    const standardDeviation = Math.sqrt(variance);

    return res.json({
      deviation: parseFloat(standardDeviation.toFixed(2)),
    });
  } catch (error) {
    logger.error("Error calculating standard deviation:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
