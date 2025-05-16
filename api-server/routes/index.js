import express from "express";
import {
  storeCryptoStats,
  getLatestStats,
  getStandardDeviation,
} from "../controllers/index.js";

const router = express.Router();

router.get("/", storeCryptoStats);
router.get("/stats", getLatestStats);
router.get("/deviation", getStandardDeviation);

export { router };
