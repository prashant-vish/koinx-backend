import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { router } from "./routes/index.js";
import { logger } from "./utils/logger.js";

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

app.listen(PORT, () => {
  logger.info(`Server is running at port ${PORT}`);
});
