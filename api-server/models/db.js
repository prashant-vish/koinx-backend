import mongoose, { Schema } from "mongoose";

const coinSchema = new Schema({
  name:String,
  price: Number,
  market_Cap: Number,
  "24hrChange": Number,
});

const statsSchema = new Schema({
  id: ,
});

const coin = new mongoose.model("Coin", coinSchema);
