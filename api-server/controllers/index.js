import axios from "axios";
import { logger } from "../utils/logger.js";
import { CryptoModel } from "../models/db.js";


const CRYPTO_COINS = ["bitcoin", "ethereum", "matic-network"];

export default async function storeCryptoStats(req, res) {
  //   fetch(url, options)
  //     .then((res) => res.json())
  //     .then((json) =>
  //       res.send({
  //         name: json.name,
  //         price: json.market_data.current_price.usd,
  //         market_cap: json.market_data.market_cap.usd,
  //         "24hr_percentage_change": json.market_data.price_change_percentage_24h,
  //       })
  //     )
  //     .catch((err) => console.error(err));
  try {
    logger.info("Fetching cryptocurrency stats from CoinGecko");

    // Fetch data for all coins in a single request to minimize API calls
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          ids: CRYPTO_COINS.join(","),
          order: "market_cap_desc",
          per_page: 100,
          page: 1,
          sparkline: false,
          price_change_percentage: "24h",
        },
      }
    );

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
      await CryptoModel.create(stats);
      logger.info(`Stored stats for ${coin.id}:`, stats);

      return stats;
    });

    await Promise.all(updatePromises);
    logger.info("All cryptocurrency stats stored successfully");

    return { success: true, message: "Cryptocurrency stats updated" };
  } catch (error) {
    logger.error("Error storing cryptocurrency stats:", error);
    throw new Error("Failed to store cryptocurrency stats");
  }
}
