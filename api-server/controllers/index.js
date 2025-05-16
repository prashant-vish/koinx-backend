import mongoose from "mongoose";

export default function storeCryptoStats(req, res) {
  const url = `https://api.coingecko.com/api/v3/coins/bitcoin`;
  const options = { method: "GET", headers: { accept: "application/json" } };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) =>
      res.send({
        name: json.name,
        price: json.market_data.current_price.usd,
        market_cap: json.market_data.market_cap.usd,
        "24hr_percentage_change": json.market_data.price_change_percentage_24h,
      })
    )
    .catch((err) => console.error(err));
}
