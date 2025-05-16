import express from "express";
import storeCryptoStats from "../controllers/index.js";

const router = express.Router();

router.get("/stats", storeCryptoStats);

export { router };
