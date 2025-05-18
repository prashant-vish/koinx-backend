import axios from "axios";
import { logger } from "../utils/logger.js";

// List of cryptocurrencies to track
const CRYPTO_COINS = ["bitcoin", "ethereum", "matic-network"];

class CoingeckoService {
  constructor() {
    this.baseURL = "https://api.coingecko.com/api/v3";
  }

  /**
   * Get current price, market cap and 24h change % for specified cryptocurrencies
   * @returns {Promise<Array>} Array of cryptocurrency stats
   */
  async getCryptoStats() {
    try {
      const response = await axios.get(`${this.baseURL}/coins/markets`, {
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

      const cryptoStats = response.data.map((coin) => ({
        coin: coin.id,
        price: coin.current_price,
        marketCap: coin.market_cap,
        "24hChange": coin.price_change_percentage_24h || 0,
      }));

      logger.info("Fetched cryptocurrency stats from CoinGecko:", cryptoStats);
      return cryptoStats;
    } catch (error) {
      logger.error("Error fetching data from CoinGecko:", error);
      throw new Error("Failed to fetch cryptocurrency data");
    }
  }
}

export const coingeckoService = new CoingeckoService();
