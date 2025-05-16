import mongoose, { Schema } from "mongoose";

const cryptoSchema = new Schema({
  coin: {
    type: String,
    required: true,
    enum: ["bitcoin", "ethereum", "matic-network"],
  },
  price: {
    type: Number,
    required: true,
  },
  marketCap: {
    type: Number,
    required: true,
  },
  "24hChange": {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const CryptoStats = new mongoose.model("CryptoStats", cryptoSchema);
